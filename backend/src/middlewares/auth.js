import { supabase } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Token ausente' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
        console.error('Erro no getUser:', error?.message);
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = { id: data.user.id, email: data.user.email };
    next();
  } catch (err) {
    next(err);
  }
}