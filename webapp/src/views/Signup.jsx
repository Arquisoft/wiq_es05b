// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {Container, Typography, TextField, Button, Snackbar, Paper} from '@mui/material';
import {Link} from "react-router-dom"

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
     <Paper elevation={3} style={{ padding: '2rem' }}>
      <Typography component="h1" variant="h5">
        Signup
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        name="password"
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={addUser}>
        Create Account
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}

      <Typography variant="body2" sx={{ marginTop: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
      </Typography>
      </Paper>
    </Container>
  );
};
