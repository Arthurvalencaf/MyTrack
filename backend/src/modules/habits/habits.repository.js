import { supabase } from '../../config/supabase.js';

export async function listByUser(userId, { includeArchived = false } = {}) {
  let query = supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (!includeArchived) {
    query = query.eq('archived', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function create(userId, { name, category, weekdays }) {
  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, name, category, weekdays })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function update(userId, habitId, fields) {
  const { data, error } = await supabase
    .from('habits')
    .update(fields)
    .eq('id', habitId)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}