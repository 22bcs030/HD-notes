import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/api';
import { Note } from '../types';
import Loader from '../components/Loader';
import DeleteIcon from '@mui/icons-material/Delete';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getNotes();
      setNotes(response.data);
      setError('');
    } catch (error: any) {
      setError('Failed to fetch notes. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenNoteDialog = () => {
    setOpenNoteDialog(true);
  };

  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      return;
    }
    
    try {
      await noteService.createNote(noteTitle, noteContent);
      handleCloseNoteDialog();
      fetchNotes();
    } catch (error: any) {
      setError('Failed to create note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      fetchNotes();
    } catch (error) {
      setError('Failed to delete note. Please try again.');
    }
  };
  
  if (loading) {
    return <Loader />;
  }
  
  const user = state.user;
  
  return (
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ddd',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid #eee'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="img" 
            src="/assets/hd-logo.svg" 
            alt="HD Logo" 
            sx={{ 
              width: 24, 
              height: 24, 
              color: '#4285F4',
              mr: 1
            }}
          />
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 500 }}>
            Dashboard
          </Typography>
        </Box>
        <Button 
          onClick={handleLogout}
          sx={{ 
            color: '#4285F4', 
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          Sign Out
        </Button>
      </Box>
      
      {/* Welcome Card */}
      <Box sx={{ p: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            border: '1px solid #eee',
            mb: 3
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Welcome, {user?.name || 'User'} !
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Email: {user?.email ? user.email.replace(/(?<=.{3}).(?=.*@)/g, 'x') : ''}
          </Typography>
        </Paper>
        
        {/* Create Note Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: '#4285F4',
            color: 'white',
            textTransform: 'none',
            borderRadius: 1,
            py: 1.5,
            mb: 3,
            '&:hover': {
              bgcolor: '#3367d6',
            }
          }}
          onClick={handleOpenNoteDialog}
        >
          Create Note
        </Button>
        
        {/* Notes List */}
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>Notes</Typography>
        
        {error && (
          <Typography 
            variant="body2" 
            color="error" 
            sx={{ mb: 2 }}
          >
            {error}
          </Typography>
        )}
        
        <List sx={{ pt: 0 }}>
          {notes.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', my: 2 }}>
              No notes yet. Create one above!
            </Typography>
          ) : (
            notes.map((note) => (
              <ListItem 
                key={note._id}
                sx={{
                  borderRadius: 1,
                  border: '1px solid #eee',
                  mb: 1.5,
                  px: 2,
                  py: 1,
                }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" size="small" onClick={() => handleDeleteNote(note._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText 
                  primary={note.title} 
                  sx={{
                    m: 0,
                    '& .MuiTypography-root': {
                      fontSize: 15,
                      fontWeight: 500,
                    }
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>
      
      {/* Bottom Home Indicator */}
      <Box 
        sx={{ 
          mt: 'auto', 
          borderTop: '1px solid #eee', 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'center' 
        }}
      >
        <Box 
          sx={{ 
            width: 100, 
            height: 5, 
            bgcolor: '#000', 
            borderRadius: 5 
          }} 
        />
      </Box>
      
      {/* Create Note Dialog */}
      <Dialog 
        open={openNoteDialog} 
        onClose={handleCloseNoteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoteDialog} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleCreateNote} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
