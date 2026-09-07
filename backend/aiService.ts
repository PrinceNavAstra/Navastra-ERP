import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { loadConfig } from './configStore';

export interface AIRequestOptions {
    prompt: string;
    systemInstruction?: string;
    model?: string;
    temperature?: number;
    responseMimeType?: string;
    highThinking?: boolean;
}

function getGeminiKey(): string {
    return process.env.GEMINI_API_KEY || '';
}

function getOpenAIKey(): string {
    return process.env.OPENAI_API_KEY || '';
}

async function fetchJSON(url: string, options: RequestInit): Promise<any> {
    const response = await fetch(url, options);
    const text = await response.text();
    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}

export async function testAiConnection() {
    const config = await loadConfig();

    if (!config.ai.enabled) {
        return {
            ok: false,
            provider: config.ai.provider,
            message: 'AI integration is disabled. Enable it in settings to start using a managed model.',
        };
    }

    if (config.ai.provider === 'gemini') {
        const apiKey = config.ai.apiKey || getGeminiKey();
        if (!apiKey) {
            return { ok: false, provider: 'gemini', message: 'Gemini API key is missing.' };
        }
        return { ok: true, provider: 'gemini', message: 'Gemini API access is configured.' };
    }

    if (config.ai.provider === 'openai') {
        const apiKey = config.ai.apiKey || getOpenAIKey();
        if (!apiKey) {
            return { ok: false, provider: 'openai', message: 'OpenAI API key is missing.' };
        }
        return { ok: true, provider: 'openai', message: 'OpenAI access is configured.' };
    }

    const hasToken = Boolean(config.ai.bearerToken || config.ai.apiKey);
    if (!hasToken) {
        return { ok: false, provider: 'custom', message: 'Custom AI token or key is missing.' };
    }

    return { ok: true, provider: 'custom', message: 'Custom provider authentication is configured.' };
}

export async function generateAIResponse(options: AIRequestOptions): Promise<string> {
    const config = await loadConfig();

    if (!config.ai.enabled) {
        throw new Error('AI integration is disabled. Please enable Gemini, OpenAI, or a custom provider in settings.');
    }

    const provider = config.ai.provider || 'gemini';
    const model = options.model || config.ai.model || 'gemini-2.5-flash';
    const systemInstruction = options.systemInstruction || 'You are a helpful ERP and CRM assistant.';
    const temperature = options.temperature ?? 0.7;

    if (provider === 'gemini') {
        const apiKey = config.ai.apiKey || getGeminiKey();
        if (!apiKey) {
            throw new Error('Gemini API key is missing. Add it in ERP settings or your .env file.');
        }

        const client = new GoogleGenAI({ apiKey });
        const response = await client.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
            config: {
                systemInstruction,
                temperature,
                ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
                ...(options.highThinking ? {
                    thinkingConfig: {
                        thinkingLevel: ThinkingLevel.HIGH,
                    },
                } : {}),
            },
        });

        return response.text || 'AI response was empty.';
    }

    if (provider === 'openai') {
        const apiKey = config.ai.apiKey || getOpenAIKey();
        if (!apiKey) {
            throw new Error('OpenAI API key is missing. Configure it in settings or .env.');
        }

        const endpoint = (config.ai.baseUrl || 'https://api.openai.com').replace(/\/$/, '') + '/v1/chat/completions';
        const payload = {
            model,
            temperature,
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: options.prompt },
            ],
        };

        const body = await fetchJSON(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        const text = body?.choices?.[0]?.message?.content;
        if (text) return Array.isArray(text) ? text.map((part: any) => part?.text || '').join('') : text;
        return JSON.stringify(body);
    }

    const endpoint = config.ai.baseUrl || 'https://api.openai.com/v1/chat/completions';
    const authHeaderName = config.ai.tokenHeader || 'Authorization';
    const authValue = config.ai.bearerToken
        ? `Bearer ${config.ai.bearerToken}`
        : config.ai.apiKey
            ? `${config.ai.apiKey}`
            : '';

    if (!authValue) {
        throw new Error('The custom AI provider requires either an API key or bearer token.');
    }

    const payload = {
        model,
        temperature,
        messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: options.prompt },
        ],
    };

    const body = await fetchJSON(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [authHeaderName]: authValue,
        },
        body: JSON.stringify(payload),
    });

    const text = body?.choices?.[0]?.message?.content;
    if (text) return Array.isArray(text) ? text.map((part: any) => part?.text || '').join('') : text;

    if (body?.output_text) return String(body.output_text);
    if (body?.text) return String(body.text);

    return JSON.stringify(body);
}
