import React, { useState, useContext } from 'react';
import axios from 'axios';
import {Container, Typography, TextField, Button, Snackbar, Paper} from '@mui/material';
import {Link} from "react-router-dom"
import { Navigate } from 'react-router';
import { AuthContext } from '../App';

export default function Login() {
  const { setUser, isAuthenticated, logout } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      if (response.data.error) {
        setError(response.data.error);
        logout()
        return;
      }

      const { token, username: user } = response.data;
      
      setUser({"token": token, "username": user})

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
        {isAuthenticated() ? (
          <Navigate to="/menu" />
        ) : (
          <div>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <TextField
              required
              margin="normal"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loginUser();
                }
              }}
            />
            <TextField
              required
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loginUser();
                }
              }}
            />
            <Button variant="contained" color="primary" onClick={loginUser}>
              Login
            </Button>
            {/* TODO - Remove first snackbar */}
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