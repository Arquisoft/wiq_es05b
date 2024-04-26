import { Route, Routes } from "react-router";
import Home from "./views/Home";
import Nav from "./views/components/Nav";
import Footer from "./views/components/Footer";
import Login from "./views/Login";
import Signup from "./views/Signup";
import About from "./views/About";
import Ranking from "./views/Ranking";
import Menu from "./views/Menu";
import Game from "./views/Game";
import Account from "./views/Account";
import Error from "./views/Error";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Particles from "./views/components/Particles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import GameContext from './views/context/GameContext';
import configDefault from "./views/components/config/particles-config.json";
import configJordi from "./views/components/config/particles-config-jordi";
import configGraph from "./views/components/config/particles-config-graph";
import defaultTheme from "./views/components/config/defaultTheme.json"

import { ConfigContext } from "./views/context/ConfigContext";
import { AuthContext } from "./views/context/AuthContext";

import "./scripts/i18next"
import {LocaleContext} from "./views/context/LocaleContext";
import {useTranslation} from "react-i18next";

const theme = createTheme(defaultTheme);

let configs = [
  configDefault,
  configGraph,
  configJordi,
];

function useAuth(i = null) {
  const init = (input) => {
    if(!input) return null;

    if (typeof input !== "string") sUser(input);
    else sUser(JSON.parse(input));
  }
  const [user, sUser] = useState(i ? init(i) : JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if(!user) return;
    axios.get(`/validate/${user.token}`)
      .then(res => {
        if(!res.data.valid) {
          logout()
        }
      })
      .catch(() => logout())
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(!user) localStorage.removeItem('user');
    else localStorage.setItem('user', JSON.stringify(user));
  }, [user])

  const getUser = () => user || null;
  const isAuthenticated = () => !!user
  const logout = () => sUser(null)
  const setUser = i => init(i);

  return {
    getUser,
    isAuthenticated,
    logout,
    setUser
  }
}

export default function App() {
  const [config, setConfig] = useState(configDefault);
  const [locale, setLocale] = useState("en");
  const {i18n, t} = useTranslation()
  const [hotQuestion, setHotQuestion] = useState(false);
  const auth = useAuth()

  function swapConfig() {
    const currentIndex = configs.findIndex(c => c === config);
    const nextIndex = (currentIndex + 1) % configs.length;
    setConfig(configs[nextIndex]);
  }

  useEffect(() => {
    axios.defaults.headers.common['Accept-Language'] = locale;
    i18n.changeLanguage(locale)
      .then(() => {})
  }, [locale, i18n])

  return (
    <ThemeProvider theme={theme}>
      <GameContext.Provider value={{ hotQuestion, setHotQuestion }}>
      <ConfigContext.Provider value={{config, swapConfig}}>
        <LocaleContext.Provider value={{locale, setLocale, t}}>
          <AuthContext.Provider value={auth}>
            <Nav />
            <Particles />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/game/:category" element={<Game />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
          </AuthContext.Provider>
        </LocaleContext.Provider>
      </ConfigContext.Provider>
      </GameContext.Provider>
    </ThemeProvider>
  );
}
