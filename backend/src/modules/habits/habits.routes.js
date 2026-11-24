import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import * as habitsController from './habits.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', habitsController.list);
router.post('/', habitsController.create);
router.patch('/:id', habitsController.update);
router.patch('/:id/archive', habitsController.archive);

export default router;