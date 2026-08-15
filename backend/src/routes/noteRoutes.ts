import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/noteController';
import { protect } from '../middlewares/authMiddleware'; 

const router = express.Router();

// applying auth middleware to all routes
// this ensures only logged in users can access notes APIs
router.use(protect); 

// routes for notes
router.post('/', createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;