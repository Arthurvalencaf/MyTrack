import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { supabase } from './config/supabase.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', async (req, res, next) => {
    try {
        const { error, status } = await supabase
  .from('habits')
  .select('id')
  .limit(1);

if (error) {
  console.error('Status do Supabase:', status, error);
  throw error;
}
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        next(err);
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor', detalhe: err.message });
});

export default app;