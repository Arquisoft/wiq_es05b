import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import CustomForm from "./components/CustomForm"
import axios from "axios"
import {LocaleContext} from "./context/LocaleContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, isAuthenticated } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  const suggestion = {
    text: t("signup_suggestion_text"),
    linkText: t("signup_suggestion_link"),
    link: "/login",
  }

  const formData = {
    title: t("signup_title"),
    submitButtonTx: t("signup_submit_button"),
    submit: (callback) => {
      axios
        .post(`/adduser`, { username, password })
        .then(({ data }) => {
          if(data.error) {
            navigate("/login");
            return
          }
          setUser({ ...data });
          navigate("/home");
        })
        .catch(error => {
          if(!error.response && error.code === 'ERR_NETWORK')
            callback(t("error_service_down_msg"))
          else
            callback(error.response.data.error);
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
      <CustomForm
        formData={formData}
        suggestion={suggestion}
      />
  );
};
