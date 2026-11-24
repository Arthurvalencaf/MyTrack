import { supabase } from '../../config/supabase.js';

export async function listByRange(userId, from, to) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('habit_id, checked_on')
    .eq('user_id', userId)
    .gte('checked_on', from)
    .lte('checked_on', to)
    .order('checked_on', { ascending: true });

  if (error) throw error;
  return data;
}

export async function add(userId, habitId, date) {
  const { error } = await supabase
    .from('check_ins')
    .upsert(
      { user_id: userId, habit_id: habitId, checked_on: date },
      { onConflict: 'habit_id,checked_on', ignoreDuplicates: true }
    );

  if (error) throw error;
}

export async function remove(userId, habitId, date) {
  const { error } = await supabase
    .from('check_ins')
    .delete()
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .eq('checked_on', date);

  if (error) throw error;
}