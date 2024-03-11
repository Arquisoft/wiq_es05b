// src/components/Login.jsx
import React, { useState } from 'react';
// import axios from 'axios';
import {Container, Typography, TextField, Button, Snackbar, Paper} from '@mui/material';
import {Link} from "react-router-dom"
import { Navigate } from 'react-router';

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  // const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      // TODO - Persist the user jwt token in the browser's local storage
      // TODO - Disabled for first release
      // const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extract data from the response
      // const { createdAt: userCreatedAt } = response.data;

      // setCreatedAt(userCreatedAt);
      setLoginSuccess(true);

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
      <Paper elevation={3} sx={{ padding: '2rem' }}>
      {loginSuccess ? (
        <Navigate to="/menu" />
      ) : (
        <div>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={loginUser}>
            Login
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
        </div>
      )}

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </Typography>
      </Paper>
    </Container>
  );
};