import express from 'express';
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from '../controllers/note-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const notes = express.Router();

notes.get('/', authMiddleware, getNotes);
notes.get('/:id', authMiddleware, getNoteById);
notes.post('/', authMiddleware, createNote);
notes.put('/:id', authMiddleware, updateNote);
notes.delete('/:id', authMiddleware, deleteNote);

export default notes;