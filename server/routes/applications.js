import { Router } from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  getStats,
  exportApplications,
  addNote,
  deleteNote,
} from '../controllers/applicationController.js';

const router = Router();

router.use(auth);

router.get('/stats', getStats);
router.get('/export', exportApplications);
router.get('/', getApplications);
router.post(
  '/',
  [body('company').trim().notEmpty(), body('role').trim().notEmpty()],
  createApplication
);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.patch('/:id/status', updateStatus);
router.post('/:id/notes', addNote);
router.delete('/:id/notes/:noteId', deleteNote);

export default router;
