import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import * as checkinsController from './checkins.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', checkinsController.list);
router.put('/:habitId/:date', checkinsController.mark);
router.delete('/:habitId/:date', checkinsController.unmark);

export default router;