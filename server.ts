import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateAIResponse, testAiConnection } from './backend/aiService';
import { loadConfig, saveConfig } from './backend/configStore';
import { testDatabaseConnection } from './backend/dbService';
import { initialNavastraApps } from './src/data/appsData';
import { readSecureJson, writeSecureJson } from './backend/cryptoService';
import {
  createCustomer,
  createInvoice,
  createLead,
  createUser,
  deleteCustomer,
  deleteInvoice,
  deleteLead,
  deleteUser,
  getCustomerById,
  getInvoiceById,
  getLeadById,
  getUserById,
  grantPermissionToUser,
  initializeErpSchema,
  listCustomers,
  listInvoices,
  listLeads,
  listPermissions,
  listUserPermissions,
  listUsers,
  revokePermissionFromUser,
  updateCustomer,
  updateInvoice,
  updateLead,
  updateUser,
} from './backend/erpService';

dotenv.config();

const appRegistryPath = path.resolve(process.cwd(), 'data', 'company-apps.json');

async function loadCompanyApps() {
  try {
    await fs.mkdir(path.dirname(appRegistryPath), { recursive: true });

    if (process.env.ERP_MASTER_KEY) {
      const parsed = await readSecureJson(appRegistryPath, initialNavastraApps);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    const raw = await fs.readFile(appRegistryPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fall back to the default base installation.
  }

  const defaultApps = [...initialNavastraApps];
  await writeSecureJson(appRegistryPath, defaultApps).catch(() => fs.writeFile(appRegistryPath, JSON.stringify(defaultApps, null, 2), 'utf-8'));
  return defaultApps;
}

async function saveCompanyApps(apps: any[]) {
  await fs.mkdir(path.dirname(appRegistryPath), { recursive: true });
  await writeSecureJson(appRegistryPath, apps).catch(() => fs.writeFile(appRegistryPath, JSON.stringify(apps, null, 2), 'utf-8'));
  return apps;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === 'production' || process.env.MODE === 'production';
  const sessionStore = new Map<string, { username: string; role: string; permissions: string[]; issuedAt: number }>();

  function signToken(payload: Record<string, string | number>) {
    const serialized = JSON.stringify(payload);
    const secret = process.env.ERP_MASTER_KEY || 'navastra-default-session-secret';
    const hash = crypto.createHmac('sha256', secret).update(serialized).digest('hex');
    return `${Buffer.from(serialized).toString('base64url')}.${hash}`;
  }

  function verifyToken(token: string) {
    if (!token || !token.includes('.')) return null;
    const [payloadPart, hash] = token.split('.');
    if (!payloadPart || !hash) return null;
    const secret = process.env.ERP_MASTER_KEY || 'navastra-default-session-secret';
    const expected = crypto.createHmac('sha256', secret).update(payloadPart).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected))) {
      try {
        return JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as { username: string; role: string; permissions: string; iat: number };
      } catch {
        return null;
      }
    }
    return null;
  }

  function getPermissionsForRole(role: string) {
    switch (role) {
      case 'super_admin':
        return ['erp.admin', 'settings.manage', 'users.manage', 'customers.view', 'customers.create', 'customers.update', 'customers.delete', 'leads.view', 'leads.create', 'leads.update', 'leads.delete', 'invoices.view', 'invoices.create', 'invoices.update', 'invoices.delete', 'permissions.manage'];
      case 'admin':
        return ['settings.manage', 'users.manage', 'customers.view', 'customers.create', 'customers.update', 'customers.delete', 'leads.view', 'leads.create', 'leads.update', 'leads.delete', 'invoices.view', 'invoices.create', 'invoices.update', 'invoices.delete'];
      case 'manager':
        return ['customers.view', 'customers.create', 'customers.update', 'leads.view', 'leads.create', 'leads.update', 'invoices.view', 'invoices.create', 'invoices.update'];
      default:
        return ['customers.view', 'leads.view', 'invoices.view'];
    }
  }

  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const token = bearerToken || req.headers['x-api-key'];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ error: 'Authentication required. Use a valid Bearer token.' });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.username || !payload.role) {
      return res.status(401).json({ error: 'Invalid or expired ERP token.' });
    }

    const session = sessionStore.get(token);
    if (!session || session.username !== payload.username) {
      return res.status(401).json({ error: 'Session expired or revoked.' });
    }

    req.user = {
      username: payload.username,
      role: payload.role,
      permissions: session.permissions,
    };

    return next();
  };

  const requirePermission = (permission: string) => (req: any, res: any, next: any) => {
    const userPermissions: string[] = req.user?.permissions || [];
    if (!userPermissions.includes(permission) && !userPermissions.includes('erp.admin') && !userPermissions.includes('settings.manage')) {
      return res.status(403).json({ error: `Permission denied: ${permission}` });
    }
    return next();
  };

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10mb' }));

  app.use((req, res, next) => {
    const pathName = req.path.toLowerCase();
    const blockedPrefixes = ['/src/', '/backend/', '/data/', '/node_modules/', '/.git/', '/@fs', '/@vite'];
    const blockedSuffixes = ['.map', '.ts', '.tsx', '.jsx', '.json'];

    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }

    if (blockedPrefixes.some(prefix => pathName.startsWith(prefix)) || blockedSuffixes.some(suffix => pathName.endsWith(suffix))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    return next();
  });

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const config = await loadConfig();
    const isAdmin = username === config.adminUsername && password === config.adminPassword;
    if (!isAdmin) {
      return res.status(401).json({ error: 'Invalid ERP credentials' });
    }

    const role = username === 'Administration' ? 'super_admin' : 'admin';
    const permissions = getPermissionsForRole(role);
    const tokenPayload = { username, role, permissions: permissions.join(','), iat: Date.now() };
    const token = signToken(tokenPayload);
    sessionStore.set(token, { username, role, permissions, issuedAt: Date.now() });

    return res.json({ token, user: { username, role, permissions }, expiresIn: '8h' });
  });

  app.use('/api', (req, _res, next) => {
    if (req.path === '/health' || req.path === '/auth/login') return next();
    return requireAuth(req, _res, next);
  });

  app.use('/api/config', requirePermission('settings.manage'));
  app.use('/api/apps', requirePermission('settings.manage'));
  app.use('/api/ai', requirePermission('settings.manage'));
  app.use('/api/erp', (req, res, next) => {
    const pathName = req.path.toLowerCase();
    let neededPermission = 'erp.admin';

    if (pathName.includes('/users')) {
      if (req.method === 'GET') neededPermission = 'users.manage';
      if (req.method === 'POST') neededPermission = 'users.create';
      if (req.method === 'PUT') neededPermission = 'users.update';
      if (req.method === 'DELETE') neededPermission = 'users.delete';
    } else if (pathName.includes('/customers')) {
      if (req.method === 'GET') neededPermission = 'customers.view';
      if (req.method === 'POST') neededPermission = 'customers.create';
      if (req.method === 'PUT') neededPermission = 'customers.update';
      if (req.method === 'DELETE') neededPermission = 'customers.delete';
    } else if (pathName.includes('/leads')) {
      if (req.method === 'GET') neededPermission = 'leads.view';
      if (req.method === 'POST') neededPermission = 'leads.create';
      if (req.method === 'PUT') neededPermission = 'leads.update';
      if (req.method === 'DELETE') neededPermission = 'leads.delete';
    } else if (pathName.includes('/invoices')) {
      if (req.method === 'GET') neededPermission = 'invoices.view';
      if (req.method === 'POST') neededPermission = 'invoices.create';
      if (req.method === 'PUT') neededPermission = 'invoices.update';
      if (req.method === 'DELETE') neededPermission = 'invoices.delete';
    } else if (pathName.includes('/permissions')) {
      neededPermission = 'permissions.manage';
    }

    return requirePermission(neededPermission)(req, res, next);
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/config', async (_req, res) => {
    try {
      const config = await loadConfig();
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load ERP configuration' });
    }
  });

  app.get('/api/apps', async (_req, res) => {
    try {
      const apps = await loadCompanyApps();
      res.json(apps);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load ERP app registry' });
    }
  });

  app.post('/api/apps', async (req, res) => {
    try {
      const payload = Array.isArray(req.body) ? req.body : [];
      const saved = await saveCompanyApps(payload);
      res.json({ ok: true, apps: saved });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to save ERP app registry' });
    }
  });

  app.post('/api/config', async (req, res) => {
    try {
      const saved = await saveConfig(req.body || {});
      if (saved.database.enabled) {
        await initializeErpSchema();
      }
      res.json({ ok: true, config: saved });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to save ERP configuration' });
    }
  });

  app.post('/api/erp/init', async (_req, res) => {
    try {
      const result = await initializeErpSchema();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to initialize ERP schema' });
    }
  });

  app.get('/api/erp/permissions', async (_req, res) => {
    try {
      const permissions = await listPermissions();
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load permissions' });
    }
  });

  app.get('/api/erp/users', async (_req, res) => {
    try {
      const users = await listUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load users' });
    }
  });

  app.get('/api/erp/users/:id', async (req, res) => {
    try {
      const user = await getUserById(Number(req.params.id));
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load user' });
    }
  });

  app.post('/api/erp/users', async (req, res) => {
    try {
      const user = await createUser(req.body || {});
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create user' });
    }
  });

  app.put('/api/erp/users/:id', async (req, res) => {
    try {
      const user = await updateUser(Number(req.params.id), req.body || {});
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update user' });
    }
  });

  app.delete('/api/erp/users/:id', async (req, res) => {
    try {
      const result = await deleteUser(Number(req.params.id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete user' });
    }
  });

  app.get('/api/erp/users/:id/permissions', async (req, res) => {
    try {
      const permissions = await listUserPermissions(Number(req.params.id));
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load user permissions' });
    }
  });

  app.post('/api/erp/users/:id/permissions', async (req, res) => {
    try {
      const { permissionCode } = req.body || {};
      if (!permissionCode) return res.status(400).json({ error: 'permissionCode is required' });
      const result = await grantPermissionToUser(Number(req.params.id), permissionCode);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to grant permission' });
    }
  });

  app.delete('/api/erp/users/:id/permissions/:permissionCode', async (req, res) => {
    try {
      const result = await revokePermissionFromUser(Number(req.params.id), req.params.permissionCode);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to revoke permission' });
    }
  });

  app.get('/api/erp/customers', async (_req, res) => {
    try {
      const customers = await listCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load customers' });
    }
  });

  app.get('/api/erp/customers/:id', async (req, res) => {
    try {
      const customer = await getCustomerById(Number(req.params.id));
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load customer' });
    }
  });

  app.post('/api/erp/customers', async (req, res) => {
    try {
      const customer = await createCustomer(req.body || {});
      res.status(201).json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create customer' });
    }
  });

  app.put('/api/erp/customers/:id', async (req, res) => {
    try {
      const customer = await updateCustomer(Number(req.params.id), req.body || {});
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update customer' });
    }
  });

  app.delete('/api/erp/customers/:id', async (req, res) => {
    try {
      const result = await deleteCustomer(Number(req.params.id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete customer' });
    }
  });

  app.get('/api/erp/leads', async (_req, res) => {
    try {
      const leads = await listLeads();
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load leads' });
    }
  });

  app.get('/api/erp/leads/:id', async (req, res) => {
    try {
      const lead = await getLeadById(Number(req.params.id));
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load lead' });
    }
  });

  app.post('/api/erp/leads', async (req, res) => {
    try {
      const lead = await createLead(req.body || {});
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create lead' });
    }
  });

  app.put('/api/erp/leads/:id', async (req, res) => {
    try {
      const lead = await updateLead(Number(req.params.id), req.body || {});
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update lead' });
    }
  });

  app.delete('/api/erp/leads/:id', async (req, res) => {
    try {
      const result = await deleteLead(Number(req.params.id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete lead' });
    }
  });

  app.get('/api/erp/invoices', async (_req, res) => {
    try {
      const invoices = await listInvoices();
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load invoices' });
    }
  });

  app.get('/api/erp/invoices/:id', async (req, res) => {
    try {
      const invoice = await getInvoiceById(Number(req.params.id));
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load invoice' });
    }
  });

  app.post('/api/erp/invoices', async (req, res) => {
    try {
      const invoice = await createInvoice(req.body || {});
      res.status(201).json(invoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create invoice' });
    }
  });

  app.put('/api/erp/invoices/:id', async (req, res) => {
    try {
      const invoice = await updateInvoice(Number(req.params.id), req.body || {});
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update invoice' });
    }
  });

  app.delete('/api/erp/invoices/:id', async (req, res) => {
    try {
      const result = await deleteInvoice(Number(req.params.id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete invoice' });
    }
  });

  app.get('/api/system-status', async (_req, res) => {
    try {
      const [dbStatus, aiStatus] = await Promise.all([
        testDatabaseConnection(),
        testAiConnection(),
      ]);

      res.json({
        database: dbStatus,
        ai: aiStatus,
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch ERP system status' });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages, rolePersona = 'assistant', model, contextData } = req.body;

      const prompt = (messages || []).map((m: any) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`).join('\n\n');
      let systemInstruction = `You are OmniCRM AI, an intelligent Enterprise ERP & CRM copilot with real-time access to deals, leads, contacts, invoices, Google Workspace (Gmail, Meet, Calendar), and territory mapping data.`;

      if (rolePersona === 'cro') {
        systemInstruction = `You are the Chief Revenue Officer (CRO) AI Advisor in OmniCRM. Your role is high-level revenue strategy, pipeline velocity optimization, closing tactics for high-value enterprise deals, competitor displacement, and deal risk mitigation. Be analytical, incisive, and provide actionable tactical playbooks.`;
      } else if (rolePersona === 'copywriter') {
        systemInstruction = `You are the Executive Sales Outreach & Copywriting Specialist in OmniCRM. You write hyper-personalized, high-converting B2B emails, negotiation replies, and executive follow-ups. Ensure emails are compelling, concise, professional, and include clear calls to action.`;
      } else if (rolePersona === 'auditor') {
        systemInstruction = `You are the ERP Financial & Operations Auditor AI in OmniCRM. You analyze invoice cash flows, DSO (Days Sales Outstanding), billing variances, contract compliance, payment terms, and margin optimization. Provide structured financial insights and warnings for overdue balances.`;
      } else if (rolePersona === 'assistant') {
        systemInstruction = `You are OmniCRM Enterprise Assistant, a helpful and knowledgeable CRM/ERP copilot. You assist users with searching deals, summarizing leads, scheduling Google Meet calls, crafting Gmail responses, analyzing client locations, and optimizing daily sales workflows.`;
      }

      if (contextData) {
        systemInstruction += `\n\nActive CRM State Context:\n${JSON.stringify(contextData, null, 2)}`;
      }

      const reply = await generateAIResponse({
        prompt: prompt || 'Provide a helpful ERP and CRM answer.',
        systemInstruction,
        model,
        temperature: 0.7,
      });

      res.json({ reply, modelUsed: model || 'configured-model' });
    } catch (error: any) {
      console.error('Error in /api/ai/chat:', error);
      res.status(500).json({ error: error.message || 'Failed to process AI chat request' });
    }
  });

  app.post('/api/ai/high-thinking', async (req, res) => {
    try {
      const { prompt, taskType, dealData, context } = req.body;

      const systemInstruction = `You are OmniCRM's High-Thinking Strategic Intelligence Core.
You perform deep, multi-stage reasoning on complex enterprise CRM and ERP challenges.
Structure your analysis with:
1. Executive Assessment & Core Dynamics
2. Deep Multi-Variable Risk Analysis & Friction Points
3. Probabilistic Scenario Forecasting (Optimistic, Base, Downside)
4. Precise Strategic Action Playbook with Exact Timelines & Tactics
5. Decision Matrix & Recommended Next Steps`;

      let fullPrompt = prompt;
      if (dealData) {
        fullPrompt += `\n\nTarget Deal / Client Dossier:\n${JSON.stringify(dealData, null, 2)}`;
      }
      if (context) {
        fullPrompt += `\n\nAdditional Enterprise Context:\n${JSON.stringify(context, null, 2)}`;
      }

      const analysis = await generateAIResponse({
        prompt: fullPrompt,
        systemInstruction,
        model: 'gemini-2.5-pro',
        temperature: 0.5,
        highThinking: true,
      });

      res.json({
        analysis,
        model: 'gemini-2.5-pro',
        thinkingMode: 'HIGH',
      });
    } catch (error: any) {
      console.error('Error in /api/ai/high-thinking:', error);
      res.status(500).json({ error: error.message || 'Failed to execute high-thinking analysis' });
    }
  });

  app.post('/api/ai/intelligence', async (req, res) => {
    try {
      const { type, payload } = req.body;

      let prompt = '';
      let systemInstruction = 'You are an enterprise AI specialist in CRM and ERP systems.';

      if (type === 'compose_email') {
        prompt = `Write a polished, high-converting B2B business email for Google Mail.
Recipient: ${payload.recipientName} (${payload.recipientEmail}, ${payload.company})
Context / Objective: ${payload.objective}
Key Points to Include: ${payload.keyPoints || 'Standard professional follow-up'}
Tone: ${payload.tone || 'Professional & Persuasive'}
Sender: ${payload.senderName || 'Alex Rivera, Enterprise Accounts Director'}`;
      } else if (type === 'meeting_prep') {
        prompt = `Create an executive meeting preparation brief and structured agenda for an upcoming Google Meet session.
Meeting Title: ${payload.title}
Client: ${payload.clientName} (${payload.company})
Attendees: ${payload.attendees?.join(', ')}
Deal Background: ${payload.dealNotes || 'Enterprise software evaluation'}
Output format:
1. Executive Summary & Objective
2. Detailed Timestamped Agenda (30-45 min)
3. 4 High-Impact Talking Points / Probing Questions
4. Potential Objections & Counter-Arguments
5. Desired Outcome / Next Milestone`;
      } else if (type === 'invoice_audit') {
        prompt = `Perform an ERP financial audit and executive summary for the following invoice:
Invoice: ${JSON.stringify(payload.invoice, null, 2)}
Customer Account: ${JSON.stringify(payload.account || {}, null, 2)}
Evaluate payment risk, suggest collection strategy if overdue, and recommend margin enhancements.`;
      } else if (type === 'deal_strategy') {
        prompt = `Develop a targeted deal acceleration strategy for this sales opportunity:
Deal Details: ${JSON.stringify(payload.deal, null, 2)}
Suggest 3 immediate tactical actions to increase close probability and shorten sales cycle.`;
      } else {
        prompt = payload.prompt || 'Analyze CRM state.';
      }

      const result = await generateAIResponse({
        prompt,
        systemInstruction,
        temperature: 0.7,
      });

      res.json({ result });
    } catch (error: any) {
      console.error('Error in /api/ai/intelligence:', error);
      res.status(500).json({ error: error.message || 'Failed to generate intelligence' });
    }
  });

  app.post('/api/ai/fast', async (req, res) => {
    try {
      const { type, payload } = req.body;

      let prompt = '';
      let responseMimeType;
      if (type === 'lead_score') {
        prompt = `Analyze this inbound lead and output a JSON object with:
"score" (0-100 number),
"temperature" ("Hot" | "Warm" | "Cold"),
"insights" (one punchy sentence why),
"recommendedAction" (one short next step).

Lead Data:
${JSON.stringify(payload.lead, null, 2)}

Return ONLY valid JSON matching this schema:
{"score": number, "temperature": "Hot"|"Warm"|"Cold", "insights": string, "recommendedAction": string}`;
        responseMimeType = 'application/json';
      } else if (type === 'smart_tags') {
        prompt = `Generate 3-5 concise, high-value business classification tags for:
Title: ${payload.title}
Company: ${payload.company}
Notes: ${payload.notes}

Return ONLY a JSON array of strings: ["Tag1", "Tag2", "Tag3"]`;
        responseMimeType = 'application/json';
      } else if (type === 'quick_summary') {
        prompt = `Summarize this CRM entity in exactly one impactful sentence:
Data: ${JSON.stringify(payload.data, null, 2)}`;
      } else {
        prompt = payload.prompt || 'Summarize briefly.';
      }

      const result = await generateAIResponse({
        prompt,
        systemInstruction: 'You are a concise ERP and CRM analyst.',
        temperature: 0.3,
        responseMimeType,
      });

      res.json({ result });
    } catch (error: any) {
      console.error('Error in /api/ai/fast:', error);
      res.status(500).json({ error: error.message || 'Failed to process fast AI task' });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      cacheDir: '.vite-cache',
      build: { sourcemap: false },
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise OmniCRM & ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
