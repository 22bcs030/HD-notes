import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Note } from '../types';
import { noteService } from '../services/api';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete }) => {
  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {note.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
            {note.content}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {new Date(note.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <IconButton color="error" onClick={() => onDelete(note._id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

interface NoteListProps {
  notes: Note[];
  onNotesChange: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onNotesChange }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      await noteService.createNote(title, content);
      setTitle('');
      setContent('');
      setError('');
      onNotesChange(); // Refresh notes
    } catch (error) {
      setError('Failed to create note. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      onNotesChange(); // Refresh notes
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add New Note
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, borderRadius: 2, px: 4 }}
        >
          Add Note
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Your Notes
        </Typography>
        {notes.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No notes yet. Create one above!
          </Typography>
        ) : (
          notes.map((note) => (
            <NoteItem key={note._id} note={note} onDelete={handleDelete} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default NoteList;
