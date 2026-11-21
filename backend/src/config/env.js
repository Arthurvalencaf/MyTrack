import 'dotenv/config';

const required = [ 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

for (const name of required) {
    if (!process.env[name]) {
        throw new Error (`Variável de ambiente ausente: ${name}`);
    }
}

export const env = {
    port: process.env.PORT || 3333,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    corsOrigin: process.env.CORS_ORIGIN || '*',
};