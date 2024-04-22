import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { Navigate } from 'react-router';
import { AuthContext } from './context/AuthContext';
import CustomForm from './components/CustomForm';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const suggestion = {
    text: "Don't have an account?", // TODO - change i18n
    linkText: "Sign up", // TODO - change i18n
    link: "/signup",
  }

  const formData = {
    title: "Login", // TODO - change i18n
    submitButtonTx: "Login", // TODO - change i18n
    submit: (callback) => {
      axios
        .post(`/login`, { username, password })
        .then(response => {
          setUser({ ...response.data})
          navigate('/menu');
        })
        .catch(error => {
          if(!error.response && error.code === 'ERR_NETWORK')
            callback("Service is down") // TODO - change i18n
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