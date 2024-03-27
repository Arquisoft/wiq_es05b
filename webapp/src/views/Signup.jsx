import React, { useState, useContext } from 'react';
import axios from 'axios';
import {Container, Typography, TextField, Button, Snackbar, Paper} from '@mui/material';
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from '../App';
import SuggestionText from './components/SuggestionText';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const addUser = () => {
    axios.post(`${apiEndpoint}/adduser`, { username, password })
      .then(({data}) => {
        setUser({"token": data.token, "username": data.username})
        navigate('/home');
      })
      .catch(({ response }) => setError(response.data.error));
  }
  return (
    <>
    <Typography component="h1" variant="h5">
        Signup
      </Typography>
      <TextField
        required
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addUser();
          }
        }}
      />
      <TextField
        required
        name="password"
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addUser();
          }
        }}
      />
      <Button variant="contained" color="primary" onClick={addUser}>
        Create Account
      </Button>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
      </>
  )
}

export default function Signup() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated()
    ? <Navigate to="/home" />
    : (
      <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <LoginForm />
          <SuggestionText text="Already have an account?" linkText="Login" link="/login" />
        </Paper>
      </Container>
  );
};
