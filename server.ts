import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google GenAI client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Multi-Turn AI Chatbot with Role-Specific Personas
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages, rolePersona = 'assistant', model = 'gemini-3.5-flash', contextData } = req.body;

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

      // Convert messages to GenAI contents format
      // Note: We use ai.models.generateContent with conversation history
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Select model
      const targetModel = model || 'gemini-3.5-flash';
      
      let config: any = {
        systemInstruction,
        temperature: 0.7,
      };

      if (targetModel === 'gemini-3.1-pro-preview') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config,
      });

      const responseText = response.text || 'I analyzed the CRM data, but could not generate a response. Please try again.';
      res.json({ reply: responseText, modelUsed: targetModel });
    } catch (error: any) {
      console.error('Error in /api/ai/chat:', error);
      res.status(500).json({ error: error.message || 'Failed to process AI chat request' });
    }
  });

  // High Thinking Mode Deep Strategic Reasoning (using gemini-3.1-pro-preview with ThinkingLevel.HIGH, no maxOutputTokens)
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

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: fullPrompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      res.json({
        analysis: response.text,
        model: 'gemini-3.1-pro-preview',
        thinkingMode: 'HIGH',
      });
    } catch (error: any) {
      console.error('Error in /api/ai/high-thinking:', error);
      res.status(500).json({ error: error.message || 'Failed to execute high-thinking analysis' });
    }
  });

  // General Gemini Intelligence (gemini-3.5-flash for general tasks)
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

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/intelligence:', error);
      res.status(500).json({ error: error.message || 'Failed to generate intelligence' });
    }
  });

  // Fast Gemini Tasks (gemini-3.1-flash-lite for instant autocomplete, tags, lead scoring)
  app.post('/api/ai/fast', async (req, res) => {
    try {
      const { type, payload } = req.body;

      let prompt = '';
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
      } else if (type === 'smart_tags') {
        prompt = `Generate 3-5 concise, high-value business classification tags for:
Title: ${payload.title}
Company: ${payload.company}
Notes: ${payload.notes}

Return ONLY a JSON array of strings: ["Tag1", "Tag2", "Tag3"]`;
      } else if (type === 'quick_summary') {
        prompt = `Summarize this CRM entity in exactly one impactful sentence:
Data: ${JSON.stringify(payload.data, null, 2)}`;
      } else {
        prompt = payload.prompt || 'Summarize briefly.';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: type === 'lead_score' || type === 'smart_tags' ? 'application/json' : undefined,
          temperature: 0.3,
        },
      });

      const text = response.text || '{}';
      res.json({ result: text });
    } catch (error: any) {
      console.error('Error in /api/ai/fast:', error);
      res.status(500).json({ error: error.message || 'Failed to process fast AI task' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise OmniCRM & ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
