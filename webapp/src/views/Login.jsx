import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { Navigate } from 'react-router';
import { AuthContext } from './context/AuthContext';
import CustomForm from './components/CustomForm';
import {LocaleContext} from "./context/LocaleContext";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setUser, logout } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  const suggestion = {
    text: t("login_suggestion_text"),
    linkText: t("login_suggestion_link"),
    link: "/signup",
  }

  const formData = {
    title: t("login_title"),
    submitButtonTx: t("login_submit_button"),
    submit: (callback) => {
      axios
        .post(`/login`, { username, password })
        .then(response => {
          setUser({ ...response.data})
          navigate('/menu');
        })
        .catch(error => {
          if(!error.response && error.code === 'ERR_NETWORK')
            callback(t("error_service_down_msg"))
          else
            callback(error.response.data.error);
          logout();
        });
    },
    fields: [
      {
        required: true,
        displayed: t("form_username"),
        name: "username",
        value: username,
        type: "text",
        changeHandler: e => setUsername(e.target.value)
      },
      {
        required: true,
        displayed: t("form_password"),
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