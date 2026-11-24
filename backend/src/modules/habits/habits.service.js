import * as habitsRepository from './habits.repository.js';
import { AppError } from '../../shared/errors.js';

export const CATEGORIES = ['Saúde', 'Estudos', 'Treino'];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError('Nome é obrigatório', 400);
  }
  if (name.trim().length > 80) {
    throw new AppError('Nome deve ter no máximo 80 caracteres', 400);
  }
  return name.trim();
}

function validateCategory(category) {
  if (!CATEGORIES.includes(category)) {
    throw new AppError(`Categoria inválida. Use: ${CATEGORIES.join(', ')}`, 400);
  }
  return category;
}

function validateWeekdays(weekdays) {
  const valid =
    Array.isArray(weekdays) &&
    weekdays.length > 0 &&
    weekdays.every((d) => Number.isInteger(d) && d >= 0 && d <= 6);

  if (!valid) {
    throw new AppError('Dias da semana devem ser números de 0 a 6', 400);
  }
  return [...new Set(weekdays)].sort((a, b) => a - b);
}

function validateId(habitId) {
  if (!UUID_REGEX.test(habitId)) {
    throw new AppError('Hábito não encontrado', 404);
  }
}

async function updateOrFail(userId, habitId, fields) {
  validateId(habitId);
  const habit = await habitsRepository.update(userId, habitId, fields);
  if (!habit) {
    throw new AppError('Hábito não encontrado', 404);
  }
  return habit;
}

export function listHabits(userId) {
  return habitsRepository.listByUser(userId);
}

export function createHabit(userId, input = {}) {
  const data = {
    name: validateName(input.name),
    category: validateCategory(input.category),
  };

  if (input.weekdays !== undefined) {
    data.weekdays = validateWeekdays(input.weekdays);
  }

  return habitsRepository.create(userId, data);
}

export function updateHabit(userId, habitId, input = {}) {
  const fields = {};

  if (input.name !== undefined) fields.name = validateName(input.name);
  if (input.category !== undefined) fields.category = validateCategory(input.category);
  if (input.weekdays !== undefined) fields.weekdays = validateWeekdays(input.weekdays);

  if (Object.keys(fields).length === 0) {
    throw new AppError('Nenhum campo para atualizar', 400);
  }

  return updateOrFail(userId, habitId, fields);
}

export function archiveHabit(userId, habitId) {
  return updateOrFail(userId, habitId, { archived: true });
}