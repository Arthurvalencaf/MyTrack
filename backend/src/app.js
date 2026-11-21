import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { supabase } from './config/supabase.js';
import { requireAuth } from './middlewares/auth.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());


app.get('/health', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('habits')
      .select('id')
      .limit(1);

    if (error) throw error;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    next(err);
  }
});


app.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratador de erros (precisa dos 4 parâmetros)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;