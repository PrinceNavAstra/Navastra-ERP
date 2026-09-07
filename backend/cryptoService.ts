import crypto from 'crypto';
import fs from 'fs/promises';

export const ERP_SECURITY_KEY_PATTERN = /^[A-Za-z0-9]{21}$/;

export function normalizeSecurityKey(rawKey: string): string {
    const key = (rawKey || '').trim();
    if (!ERP_SECURITY_KEY_PATTERN.test(key)) {
        throw new Error('Security key must be exactly 21 alphanumeric characters.');
    }
    return key;
}

export function getMasterKey(): string {
    const key = process.env.ERP_MASTER_KEY || '';
    return normalizeSecurityKey(key);
}

function deriveKey(secret: string): Buffer {
    return crypto.createHash('sha256').update(secret).digest();
}

export function encryptText(plainText: string, masterKey: string): string {
    const key = deriveKey(normalizeSecurityKey(masterKey));
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return JSON.stringify({
        v: 1,
        iv: iv.toString('hex'),
        content: encrypted.toString('base64'),
        tag: tag.toString('hex'),
    });
}

export function decryptText(cipherText: string, masterKey: string): string {
    const key = deriveKey(normalizeSecurityKey(masterKey));
    const parsed = JSON.parse(cipherText) as { v?: number; iv?: string; content?: string; tag?: string };

    if (!parsed || !parsed.iv || !parsed.content || !parsed.tag) {
        throw new Error('Invalid encrypted payload.');
    }

    const iv = Buffer.from(parsed.iv, 'hex');
    const content = Buffer.from(parsed.content, 'base64');
    const tag = Buffer.from(parsed.tag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
}

export async function readSecureJson<T>(filePath: string, fallback: T): Promise<T> {
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        const trimmed = raw.trim();

        if (!trimmed) {
            return fallback;
        }

        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                return JSON.parse(trimmed) as T;
            } catch {
                // Legacy plain text may still have been encrypted using the secure format.
            }
        }

        return JSON.parse(decryptText(trimmed, getMasterKey())) as T;
    } catch (error: any) {
        if (error && error.code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
            return fallback;
        }

        if (error && error.message && error.message.includes('No ERP master key')) {
            await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
            return fallback;
        }

        throw error;
    }
}

export async function writeSecureJson<T>(filePath: string, value: T): Promise<T> {
    try {
        const masterKey = getMasterKey();
        const encrypted = encryptText(JSON.stringify(value), masterKey);
        await fs.mkdir(filePath.substring(0, filePath.lastIndexOf('/') || filePath.lastIndexOf('\\') + 1) || '.', { recursive: true });
        await fs.writeFile(filePath, encrypted, 'utf-8');
        return value;
    } catch (error: any) {
        if (error && error.message && error.message.includes('Security key must be exactly 21 alphanumeric characters')) {
            await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
            return value;
        }
        await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
        return value;
    }
}
