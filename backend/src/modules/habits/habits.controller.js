import * as habitsService from './habits.service.js';

export async function list(req, res) {
  const habits = await habitsService.listHabits(req.user.id);
  res.json(habits);
}

export async function create(req, res) {
  const habit = await habitsService.createHabit(req.user.id, req.body);
  res.status(201).json(habit);
}

export async function update(req, res) {
  const habit = await habitsService.updateHabit(req.user.id, req.params.id, req.body);
  res.json(habit);
}

export async function archive(req, res) {
  const habit = await habitsService.archiveHabit(req.user.id, req.params.id);
  res.json(habit);
}