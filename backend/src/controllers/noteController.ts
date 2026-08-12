import { Response, NextFunction } from 'express';
import Note from '../models/Note';
import logger from '../config/logger';
import { AuthRequest } from '../middlewares/authMiddleware'; 

// Create a new note
export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => { 
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    // validation check
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both title and content for the note' 
      });
    }

    const newNote = await Note.create({
      title: title,
      content: content,
      user: userId
    });

    logger.info(`New note created by user: ${userId}`);

    res.status(201).json({
      success: true,
      data: newNote
    });

  } catch (error) {
    logger.error('Error in createNote:', error);
    next(error);
  }
};

// Get all notes for logged in user 
export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const searchQuery = req.query.search as string;
    
    let queryObj: any = { user: userId };

    // if user typed something in search bar, use text index
    if (searchQuery) {
       queryObj.$text = { $search: searchQuery };
    }

    // sort by latest first
    const myNotes = await Note.find(queryObj).sort({ createdAt: -1 });

    logger.info(`Fetched ${myNotes.length} notes for user: ${userId}`);

    res.status(200).json({
      success: true,
      count: myNotes.length,
      data: myNotes
    });

  } catch (error) {
    logger.error('Error fetching notes:', error);
    next(error);
  }
};

// Update an existing note
export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.user?.id;

    let noteToUpdate = await Note.findById(noteId);

    // check if note actually exists
    if (!noteToUpdate) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // user can only edit their own notes
    if (noteToUpdate.user.toString() !== userId) {
      logger.warn(`Unauthorized edit attempt by user ${userId} on note ${noteId}`);
      return res.status(403).json({ success: false, message: 'Not authorized to update this note' });
    }

    const { title, content } = req.body;

    // update the fields
    noteToUpdate = await Note.findByIdAndUpdate(
      noteId, 
      { title, content }, 
      { new: true, runValidators: true }
    );

    logger.info(`Note ${noteId} updated by user ${userId}`);

    res.status(200).json({
      success: true,
      data: noteToUpdate
    });

  } catch (error) {
    next(error);
  }
};

// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.user?.id;

    const noteToDelete = await Note.findById(noteId);

    if (!noteToDelete) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // strict check for deletion
    if (noteToDelete.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this note' });
    }

    await noteToDelete.deleteOne();
    
    logger.info(`Note ${noteId} deleted by user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};