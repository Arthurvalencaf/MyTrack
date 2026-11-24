import * as checkinsService from './checkins.service.js';

export async function list(req, res) {
  const checkins = await checkinsService.listCheckins(req.user.id, req.query);
  res.json(checkins);
}

export async function mark(req, res) {
  const checkin = await checkinsService.markCheckin(
    req.user.id,
    req.params.habitId,
    req.params.date
  );
  res.json(checkin);
}

export async function unmark(req, res) {
  await checkinsService.unmarkCheckin(req.user.id, req.params.habitId, req.params.date);
  res.status(204).send();
}