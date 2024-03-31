import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { Navigate } from 'react-router';
import { AuthContext } from '../views/context/AuthContext';
import CustomForm from './components/CustomForm';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const suggestion = {
    text: "Don't have an account?",
    linkText: "Sign up",
    link: "/signup",
  }

  const formData = {
    title: "Login",
    submitButtonTx: "Login",
    submit: (callback) => {
      axios
        .post(`${apiEndpoint}/login`, { username, password })
        .then(response => {
          
          setUser({ ...response.data})
          navigate('/menu');
        })
        .catch(error => {
          if(!error.response && error.code === 'ERR_NETWORK')
            callback("Service is down")
          else
            callback(error.response.data.error);
          logout();
        });
    },
    fields: [
      {
        required: true,
        displayed: "Username",
        name: "username",
        value: username,
        type: "text",
        changeHandler: e => setUsername(e.target.value)
      },
      {
        required: true,
        displayed: "Password",
        name: "password",
        value: password,
        type: "password",
        changeHandler: e => setPassword(e.target.value)
      },
    ]
  
  }

  return isAuthenticated()
    ? <Navigate to="/home" />
    : (
    <CustomForm formData={formData} suggestion={suggestion} />
  );
};