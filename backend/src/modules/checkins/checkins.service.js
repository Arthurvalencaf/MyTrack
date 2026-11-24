import * as checkinsRepository from './checkins.repository.js';
import * as habitsService from '../habits/habits.service.js';
import { AppError } from '../../shared/errors.js';

const MAX_RANGE_DAYS = 366;

function validateDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new AppError('Data inválida. Use o formato AAAA-MM-DD', 400);
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new AppError('Data inválida', 400);
  }

  return value;
}

function validateNotFuture(date) {
  const limit = new Date();
  limit.setUTCDate(limit.getUTCDate() + 1);

  if (date > limit.toISOString().slice(0, 10)) {
    throw new AppError('Não é possível marcar datas futuras', 400);
  }
}

function validateRange(from, to) {
  validateDate(from);
  validateDate(to);

  if (from > to) {
    throw new AppError('A data inicial deve ser anterior à final', 400);
  }

  const days = (new Date(`${to}T00:00:00Z`) - new Date(`${from}T00:00:00Z`)) / 86400000;
  if (days > MAX_RANGE_DAYS) {
    throw new AppError(`O intervalo máximo é de ${MAX_RANGE_DAYS} dias`, 400);
  }
}

export function listCheckins(userId, { from, to } = {}) {
  validateRange(from, to);
  return checkinsRepository.listByRange(userId, from, to);
}

export async function markCheckin(userId, habitId, date) {
  validateDate(date);
  validateNotFuture(date);

  const habit = await habitsService.getHabit(userId, habitId);
  if (habit.archived) {
    throw new AppError('Hábito arquivado não aceita check-in', 400);
  }

  await checkinsRepository.add(userId, habit.id, date);
  return { habit_id: habit.id, checked_on: date };
}

export async function unmarkCheckin(userId, habitId, date) {
  validateDate(date);
  await habitsService.getHabit(userId, habitId);
  await checkinsRepository.remove(userId, habitId, date);
}