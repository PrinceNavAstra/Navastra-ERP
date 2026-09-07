import { Pool } from 'pg';
import { getDatabasePool } from './dbService';
import { readFileSync } from 'fs';
import path from 'path';

export interface CustomerInput {
    name: string;
    email?: string;
    phone?: string;
    company_name?: string;
    customer_type?: string;
    status?: string;
    tax_id?: string;
    billing_address?: string;
    shipping_address?: string;
    notes?: string;
    created_by?: number | null;
}

export interface LeadInput {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: string;
    value?: number;
    assigned_to?: number | null;
    customer_id?: number | null;
    notes?: string;
    created_by?: number | null;
}

export interface InvoiceInput {
    invoice_number: string;
    customer_id: number;
    issue_date?: string;
    due_date?: string | null;
    amount_total?: number;
    amount_paid?: number;
    status?: string;
    currency?: string;
    notes?: string;
    created_by?: number | null;
}

export interface UserInput {
    name: string;
    email: string;
    password_hash?: string;
    role?: string;
    active?: boolean;
}

export interface PermissionInput {
    code: string;
    name: string;
    description?: string;
}

export const ERP_SCHEMA_SQL = readFileSync(path.join(process.cwd(), 'backend', 'erpSchema.sql'), 'utf-8');

const DEFAULT_PERMISSIONS = [
    ['customers.view', 'View Customers', 'Read customer records'],
    ['customers.create', 'Create Customers', 'Create new customer accounts'],
    ['customers.update', 'Update Customers', 'Edit customer information'],
    ['customers.delete', 'Delete Customers', 'Remove customer records'],
    ['leads.view', 'View Leads', 'Read lead records'],
    ['leads.create', 'Create Leads', 'Create new leads'],
    ['leads.update', 'Update Leads', 'Edit lead information'],
    ['leads.delete', 'Delete Leads', 'Remove leads'],
    ['invoices.view', 'View Invoices', 'Read invoice records'],
    ['invoices.create', 'Create Invoices', 'Create invoices'],
    ['invoices.update', 'Update Invoices', 'Edit invoices'],
    ['invoices.delete', 'Delete Invoices', 'Delete invoices'],
    ['users.view', 'View Users', 'Read users'],
    ['users.create', 'Create Users', 'Create users'],
    ['users.update', 'Update Users', 'Edit user profiles'],
    ['users.delete', 'Delete Users', 'Delete users'],
    ['permissions.manage', 'Manage Permissions', 'Grant or revoke permissions'],
    ['erp.admin', 'ERP Admin', 'Full ERP system access'],
] as const;

const DEFAULT_ADMIN_PASSWORD = process.env.ERP_ADMIN_PASSWORD || 'Navastra';

const SYSTEM_BOOTSTRAP_USERS = [
    {
        name: 'Administration',
        email: 'administration@navastra.local',
        role: 'super_admin',
        password_hash: DEFAULT_ADMIN_PASSWORD,
        permissions: ['erp.admin', 'customers.view', 'customers.create', 'customers.update', 'customers.delete', 'leads.view', 'leads.create', 'leads.update', 'leads.delete', 'invoices.view', 'invoices.create', 'invoices.update', 'invoices.delete', 'users.view', 'users.create', 'users.update', 'users.delete', 'permissions.manage']
    },
    {
        name: 'Admin',
        email: 'admin@navastra.local',
        role: 'admin',
        password_hash: DEFAULT_ADMIN_PASSWORD,
        permissions: ['erp.admin', 'customers.view', 'customers.create', 'customers.update', 'customers.delete', 'leads.view', 'leads.create', 'leads.update', 'leads.delete', 'invoices.view', 'invoices.create', 'invoices.update', 'invoices.delete', 'users.view', 'users.create', 'users.update', 'users.delete', 'permissions.manage']
    },
    {
        name: 'NavAstra Bot',
        email: 'bot@navastra.local',
        role: 'bot',
        password_hash: DEFAULT_ADMIN_PASSWORD,
        permissions: ['customers.view', 'customers.create', 'leads.view', 'leads.create', 'invoices.view', 'invoices.create']
    },
] as const;

async function getPool(): Promise<Pool> {
    const pool = await getDatabasePool();
    if (!pool) {
        throw new Error('PostgreSQL is not enabled. Turn on database connectivity in ERP settings first.');
    }
    return pool;
}

export async function initializeErpSchema() {
    const pool = await getPool();
    await pool.query(ERP_SCHEMA_SQL);
    await seedDefaultPermissions(pool);
    await seedBootstrapUsers(pool);

    return {
        ok: true,
        message: 'ERP schema, default access rules, and system bootstrap users initialized successfully.',
    };
}

async function seedDefaultPermissions(pool: Pool) {
    for (const [code, name, description] of DEFAULT_PERMISSIONS) {
        await pool.query(
            `INSERT INTO permissions (code, name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (code) DO NOTHING`,
            [code, name, description]
        );
    }
}

async function seedBootstrapUsers(pool: Pool) {
    const activePassword = process.env.ERP_ADMIN_PASSWORD || 'Navastra';

    for (const user of SYSTEM_BOOTSTRAP_USERS) {
        const normalizedUser = {
            ...user,
            password_hash: activePassword,
        };

        const existingUser = await pool.query(
            `SELECT id FROM users WHERE email = $1 LIMIT 1`,
            [normalizedUser.email]
        );

        let userId: number;

        if (existingUser.rowCount && existingUser.rows[0]) {
            userId = Number(existingUser.rows[0].id);
            await pool.query(
                `UPDATE users
                 SET name = $1, password_hash = $2, role = $3, active = true, updated_at = NOW()
                 WHERE id = $4`,
                [normalizedUser.name, normalizedUser.password_hash, normalizedUser.role, userId]
            );
        } else {
            const created = await pool.query(
                `INSERT INTO users (name, email, password_hash, role, active)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id`,
                [normalizedUser.name, normalizedUser.email, normalizedUser.password_hash, normalizedUser.role, true]
            );
            userId = Number(created.rows[0].id);
        }

        const permissionRows = await pool.query(
            `SELECT id, code FROM permissions WHERE code = ANY($1)`,
            [normalizedUser.permissions]
        );

        for (const permission of permissionRows.rows) {
            await pool.query(
                `INSERT INTO user_permissions (user_id, permission_id)
                 VALUES ($1, $2)
                 ON CONFLICT (user_id, permission_id) DO NOTHING`,
                [userId, permission.id]
            );
        }
    }
}

export async function listUsers() {
    const pool = await getPool();
    const result = await pool.query(`
    SELECT u.*, ARRAY_AGG(p.code ORDER BY p.code) AS permissions
    FROM users u
    LEFT JOIN user_permissions up ON up.user_id = u.id
    LEFT JOIN permissions p ON p.id = up.permission_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
    return result.rows;
}

export async function getUserById(userId: number) {
    const pool = await getPool();
    const result = await pool.query(`
    SELECT u.*, ARRAY_AGG(p.code ORDER BY p.code) AS permissions
    FROM users u
    LEFT JOIN user_permissions up ON up.user_id = u.id
    LEFT JOIN permissions p ON p.id = up.permission_id
    WHERE u.id = $1
    GROUP BY u.id
  `, [userId]);
    return result.rows[0] ?? null;
}

export async function createUser(input: UserInput) {
    const pool = await getPool();
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [
            input.name,
            input.email,
            input.password_hash || '',
            input.role || 'user',
            input.active ?? true,
        ]
    );
    return result.rows[0];
}

export async function updateUser(userId: number, input: Partial<UserInput>) {
    const pool = await getPool();
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(input)) {
        if (value === undefined) continue;
        fields.push(`${key} = $${index}`);
        values.push(value);
        index += 1;
    }

    if (!fields.length) return getUserById(userId);

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
}

export async function deleteUser(userId: number) {
    const pool = await getPool();
    await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
    return { ok: true, id: userId };
}

export async function listPermissions() {
    const pool = await getPool();
    const result = await pool.query(`SELECT * FROM permissions ORDER BY name ASC`);
    return result.rows;
}

export async function grantPermissionToUser(userId: number, permissionCode: string) {
    const pool = await getPool();
    const permissionResult = await pool.query(
        `SELECT id FROM permissions WHERE code = $1`,
        [permissionCode]
    );

    if (!permissionResult.rowCount) {
        throw new Error(`Permission code not found: ${permissionCode}`);
    }

    const permissionId = permissionResult.rows[0].id;
    const result = await pool.query(
        `INSERT INTO user_permissions (user_id, permission_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, permission_id) DO NOTHING
     RETURNING *`,
        [userId, permissionId]
    );

    return result.rows[0] ?? { user_id: userId, permission_id: permissionId };
}

export async function revokePermissionFromUser(userId: number, permissionCode: string) {
    const pool = await getPool();
    await pool.query(
        `DELETE FROM user_permissions
     WHERE user_id = $1 AND permission_id = (
       SELECT id FROM permissions WHERE code = $2
     )`,
        [userId, permissionCode]
    );
    return { ok: true, user_id: userId, permission_code: permissionCode };
}

export async function listCustomers() {
    const pool = await getPool();
    const result = await pool.query(`
    SELECT c.*, u.name AS created_by_name
    FROM customers c
    LEFT JOIN users u ON u.id = c.created_by
    ORDER BY c.created_at DESC
  `);
    return result.rows;
}

export async function getCustomerById(customerId: number) {
    const pool = await getPool();
    const result = await pool.query(
        `SELECT c.*, u.name AS created_by_name
     FROM customers c
     LEFT JOIN users u ON u.id = c.created_by
     WHERE c.id = $1`,
        [customerId]
    );
    return result.rows[0] ?? null;
}

export async function createCustomer(input: CustomerInput) {
    const pool = await getPool();
    const result = await pool.query(
        `INSERT INTO customers (
       name, email, phone, company_name, customer_type, status, tax_id,
       billing_address, shipping_address, notes, created_by
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
        [
            input.name,
            input.email || null,
            input.phone || null,
            input.company_name || null,
            input.customer_type || 'business',
            input.status || 'active',
            input.tax_id || null,
            input.billing_address || null,
            input.shipping_address || null,
            input.notes || null,
            input.created_by ?? null,
        ]
    );
    return result.rows[0];
}

export async function updateCustomer(customerId: number, input: Partial<CustomerInput>) {
    const pool = await getPool();
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(input)) {
        if (value === undefined) continue;
        fields.push(`${key} = $${index}`);
        values.push(value);
        index += 1;
    }

    if (!fields.length) return getCustomerById(customerId);

    values.push(customerId);
    const query = `UPDATE customers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
}

export async function deleteCustomer(customerId: number) {
    const pool = await getPool();
    await pool.query(`DELETE FROM customers WHERE id = $1`, [customerId]);
    return { ok: true, id: customerId };
}

export async function listLeads() {
    const pool = await getPool();
    const result = await pool.query(`
    SELECT l.*, u.name AS assigned_to_name, c.name AS customer_name
    FROM leads l
    LEFT JOIN users u ON u.id = l.assigned_to
    LEFT JOIN customers c ON c.id = l.customer_id
    ORDER BY l.created_at DESC
  `);
    return result.rows;
}

export async function getLeadById(leadId: number) {
    const pool = await getPool();
    const result = await pool.query(
        `SELECT l.*, u.name AS assigned_to_name, c.name AS customer_name
     FROM leads l
     LEFT JOIN users u ON u.id = l.assigned_to
     LEFT JOIN customers c ON c.id = l.customer_id
     WHERE l.id = $1`,
        [leadId]
    );
    return result.rows[0] ?? null;
}

export async function createLead(input: LeadInput) {
    const pool = await getPool();
    const result = await pool.query(
        `INSERT INTO leads (
      name, email, phone, company, source, status, value,
      assigned_to, customer_id, notes, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
        [
            input.name,
            input.email || null,
            input.phone || null,
            input.company || null,
            input.source || 'web',
            input.status || 'new',
            input.value ?? 0,
            input.assigned_to ?? null,
            input.customer_id ?? null,
            input.notes || null,
            input.created_by ?? null,
        ]
    );
    return result.rows[0];
}

export async function updateLead(leadId: number, input: Partial<LeadInput>) {
    const pool = await getPool();
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(input)) {
        if (value === undefined) continue;
        fields.push(`${key} = $${index}`);
        values.push(value);
        index += 1;
    }

    if (!fields.length) return getLeadById(leadId);

    values.push(leadId);
    const query = `UPDATE leads SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
}

export async function deleteLead(leadId: number) {
    const pool = await getPool();
    await pool.query(`DELETE FROM leads WHERE id = $1`, [leadId]);
    return { ok: true, id: leadId };
}

export async function listInvoices() {
    const pool = await getPool();
    const result = await pool.query(`
    SELECT i.*, c.name AS customer_name, u.name AS created_by_name
    FROM invoices i
    LEFT JOIN customers c ON c.id = i.customer_id
    LEFT JOIN users u ON u.id = i.created_by
    ORDER BY i.created_at DESC
  `);
    return result.rows;
}

export async function getInvoiceById(invoiceId: number) {
    const pool = await getPool();
    const result = await pool.query(
        `SELECT i.*, c.name AS customer_name, u.name AS created_by_name
     FROM invoices i
     LEFT JOIN customers c ON c.id = i.customer_id
     LEFT JOIN users u ON u.id = i.created_by
     WHERE i.id = $1`,
        [invoiceId]
    );
    return result.rows[0] ?? null;
}

export async function createInvoice(input: InvoiceInput) {
    const pool = await getPool();
    const result = await pool.query(
        `INSERT INTO invoices (
      invoice_number, customer_id, issue_date, due_date,
      amount_total, amount_paid, status, currency, notes, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
        [
            input.invoice_number,
            input.customer_id,
            input.issue_date || new Date().toISOString().slice(0, 10),
            input.due_date || null,
            input.amount_total ?? 0,
            input.amount_paid ?? 0,
            input.status || 'draft',
            input.currency || 'USD',
            input.notes || null,
            input.created_by ?? null,
        ]
    );
    return result.rows[0];
}

export async function updateInvoice(invoiceId: number, input: Partial<InvoiceInput>) {
    const pool = await getPool();
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(input)) {
        if (value === undefined) continue;
        fields.push(`${key} = $${index}`);
        values.push(value);
        index += 1;
    }

    if (!fields.length) return getInvoiceById(invoiceId);

    values.push(invoiceId);
    const query = `UPDATE invoices SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
}

export async function deleteInvoice(invoiceId: number) {
    const pool = await getPool();
    await pool.query(`DELETE FROM invoices WHERE id = $1`, [invoiceId]);
    return { ok: true, id: invoiceId };
}

export async function listUserPermissions(userId: number) {
    const pool = await getPool();
    const result = await pool.query(
        `SELECT p.*
     FROM permissions p
     JOIN user_permissions up ON up.permission_id = p.id
     WHERE up.user_id = $1
     ORDER BY p.name ASC`,
        [userId]
    );
    return result.rows;
}
