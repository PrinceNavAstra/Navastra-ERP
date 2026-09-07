import { Pool } from 'pg';
import { getDatabasePoolConfig, loadConfig } from './configStore';

let pool: Pool | null = null;

export async function getDatabasePool(): Promise<Pool | null> {
    const config = await loadConfig();
    const poolConfig = getDatabasePoolConfig(config);
    if (!poolConfig) return null;

    if (!pool) {
        pool = new Pool(poolConfig);
    }

    return pool;
}

export async function testDatabaseConnection() {
    const databasePool = await getDatabasePool();

    if (!databasePool) {
        return {
            ok: false,
            message: 'PostgreSQL is not enabled. Turn it on in the ERP settings to enable database connectivity.',
        };
    }

    try {
        const result = await databasePool.query('SELECT NOW() as current_time, 1 as ok');
        return {
            ok: true,
            message: 'Connected to PostgreSQL successfully.',
            timestamp: result.rows[0]?.current_time,
            result: result.rows[0],
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message || 'Failed to connect to PostgreSQL.',
            error: error.message,
        };
    }
}
