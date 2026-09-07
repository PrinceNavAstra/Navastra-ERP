import fs from 'fs/promises';
import path from 'path';
import { decryptText, encryptText, readSecureJson, writeSecureJson } from './cryptoService';

export type AiProvider = 'gemini' | 'openai' | 'custom';

export interface DatabaseSettings {
    enabled: boolean;
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl: boolean;
}

export interface AiSettings {
    enabled: boolean;
    provider: AiProvider;
    model: string;
    apiKey: string;
    bearerToken: string;
    tokenHeader: string;
    baseUrl: string;
}

export interface AppSettings {
    database: DatabaseSettings;
    ai: AiSettings;
    securityKey: string;
    companyName: string;
    companyCountry: string;
    fiscalYear: string;
    chartOfAccountsMode: 'basic' | 'import';
    adminUsername: string;
    adminPassword: string;
}

export const defaultConfig: AppSettings = {
    database: {
        enabled: false,
        host: 'localhost',
        port: 5432,
        database: 'navastra_erp',
        user: 'postgres',
        password: 'postgres',
        ssl: false,
    },
    ai: {
        enabled: false,
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: '',
        bearerToken: '',
        tokenHeader: 'Authorization',
        baseUrl: 'https://generativelanguage.googleapis.com',
    },
    securityKey: '',
    companyName: 'Navastra Enterprise Inc',
    companyCountry: 'India',
    fiscalYear: 'April 1 - March 31',
    chartOfAccountsMode: 'basic',
    adminUsername: 'Administration',
    adminPassword: 'Navastra',
};

const configFilePath = path.resolve(process.cwd(), 'data', 'system-config.json');

export async function loadConfig(): Promise<AppSettings> {
    try {
        await fs.mkdir(path.dirname(configFilePath), { recursive: true });

        if (process.env.ERP_MASTER_KEY) {
            const parsed = await readSecureJson<AppSettings>(configFilePath, defaultConfig);
            return {
                database: { ...defaultConfig.database, ...parsed.database },
                ai: { ...defaultConfig.ai, ...parsed.ai },
                securityKey: parsed.securityKey || process.env.ERP_MASTER_KEY || '',
                companyName: parsed.companyName || defaultConfig.companyName,
                companyCountry: parsed.companyCountry || defaultConfig.companyCountry,
                fiscalYear: parsed.fiscalYear || defaultConfig.fiscalYear,
                chartOfAccountsMode: parsed.chartOfAccountsMode || defaultConfig.chartOfAccountsMode,
                adminUsername: parsed.adminUsername || defaultConfig.adminUsername,
                adminPassword: parsed.adminPassword || defaultConfig.adminPassword,
            };
        }

        const raw = await fs.readFile(configFilePath, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<AppSettings>;
        return {
            database: { ...defaultConfig.database, ...parsed.database },
            ai: { ...defaultConfig.ai, ...parsed.ai },
            securityKey: parsed.securityKey || '',
            companyName: parsed.companyName || defaultConfig.companyName,
            companyCountry: parsed.companyCountry || defaultConfig.companyCountry,
            fiscalYear: parsed.fiscalYear || defaultConfig.fiscalYear,
            chartOfAccountsMode: parsed.chartOfAccountsMode || defaultConfig.chartOfAccountsMode,
            adminUsername: parsed.adminUsername || defaultConfig.adminUsername,
            adminPassword: parsed.adminPassword || defaultConfig.adminPassword,
        };
    } catch (error) {
        await fs.mkdir(path.dirname(configFilePath), { recursive: true });
        await writeSecureJson(configFilePath, defaultConfig).catch(() => fs.writeFile(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf-8'));
        return defaultConfig;
    }
}

function encryptSensitiveValue(value: string, key: string): string {
    if (!value) return '';
    return `enc:${encryptText(value, key)}`;
}

function decryptSensitiveValue(value: string | undefined, key: string): string {
    if (!value) return '';
    if (typeof value !== 'string' || !value.startsWith('enc:')) return value;
    return decryptText(value.replace(/^enc:/, ''), key);
}

export async function saveConfig(nextConfig: Partial<AppSettings>): Promise<AppSettings> {
    const current = await loadConfig();
    const merged: AppSettings = {
        database: { ...current.database, ...nextConfig.database },
        ai: { ...current.ai, ...nextConfig.ai },
        securityKey: nextConfig.securityKey ?? current.securityKey ?? '',
        companyName: nextConfig.companyName ?? current.companyName ?? defaultConfig.companyName,
        companyCountry: nextConfig.companyCountry ?? current.companyCountry ?? defaultConfig.companyCountry,
        fiscalYear: nextConfig.fiscalYear ?? current.fiscalYear ?? defaultConfig.fiscalYear,
        chartOfAccountsMode: nextConfig.chartOfAccountsMode ?? current.chartOfAccountsMode ?? defaultConfig.chartOfAccountsMode,
        adminUsername: nextConfig.adminUsername ?? current.adminUsername ?? defaultConfig.adminUsername,
        adminPassword: nextConfig.adminPassword ?? current.adminPassword ?? defaultConfig.adminPassword,
    };

    const masterKey = merged.securityKey || process.env.ERP_MASTER_KEY || 'navastra-erp-default-21-key';
    const protectedConfig: AppSettings = {
        ...merged,
        database: {
            ...merged.database,
            password: encryptSensitiveValue(merged.database.password, masterKey),
        },
        ai: {
            ...merged.ai,
            apiKey: encryptSensitiveValue(merged.ai.apiKey, masterKey),
            bearerToken: encryptSensitiveValue(merged.ai.bearerToken, masterKey),
        },
        securityKey: masterKey,
        adminPassword: encryptSensitiveValue(merged.adminPassword, masterKey),
    };

    if (merged.securityKey) {
        process.env.ERP_MASTER_KEY = merged.securityKey;
    }
    process.env.ERP_ADMIN_USERNAME = merged.adminUsername || 'Administration';
    process.env.ERP_ADMIN_PASSWORD = merged.adminPassword || 'Navastra';

    await fs.mkdir(path.dirname(configFilePath), { recursive: true });
    await writeSecureJson(configFilePath, protectedConfig).catch(() => fs.writeFile(configFilePath, JSON.stringify(protectedConfig, null, 2), 'utf-8'));

    if (merged.database.enabled) {
        process.env.POSTGRES_HOST = merged.database.host;
        process.env.POSTGRES_PORT = String(merged.database.port);
        process.env.POSTGRES_DB = merged.database.database;
        process.env.POSTGRES_USER = merged.database.user;
        process.env.POSTGRES_PASSWORD = merged.database.password;
        process.env.POSTGRES_SSL = String(merged.database.ssl);
    }

    if (merged.ai.enabled) {
        process.env.AI_PROVIDER = merged.ai.provider;
        process.env.AI_MODEL = merged.ai.model;
        process.env.AI_API_KEY = merged.ai.apiKey;
        process.env.AI_BEARER_TOKEN = merged.ai.bearerToken;
        process.env.AI_TOKEN_HEADER = merged.ai.tokenHeader;
        process.env.AI_BASE_URL = merged.ai.baseUrl;
    }

    return merged;
}

export function getDatabasePoolConfig(config: AppSettings) {
    if (!config.database.enabled) return null;

    return {
        host: config.database.host || 'localhost',
        port: Number(config.database.port || 5432),
        database: config.database.database || 'navastra_erp',
        user: config.database.user || 'postgres',
        password: config.database.password || 'postgres',
        ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    };
}
