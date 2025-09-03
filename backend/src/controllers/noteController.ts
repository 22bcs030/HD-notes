import { Request, Response } from 'express';
import Note from '../models/Note';

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: 'Please provide both title and content' });
      return;
    }

    const note = await Note.create({
      title,
      content,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single note
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // Check if the note belongs to the user
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // Check if the note belongs to the user
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await note.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
