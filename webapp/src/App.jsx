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
import Logout from "./views/components/Logout"
import Account from "./views/Account";
import Error from "./views/Error";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Particles from "./views/components/Particles";
import React, { useState, useEffect } from "react";
import Endgame from "./views/Endgame";

import configDefault from "./views/components/config/particles-config.json";
import configJordi from "./views/components/config/particles-config-jordi";
import configGraph from "./views/components/config/particles-config-graph";

import { ConfigContext } from "./views/context/ConfigContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e3487", // Your primary color
      contrastText: "#FFF",
    },
    secondary: {
      main: "#f2f2f2", // Your secondary color
      contrastText: "#2e3487",
    },
    dark: {
      main: "#0f0f5e",
      contrastText: "#F2F2F2",
    },
    light: {
      main: "#5e86cf",
      contrastText: "#F2F2F2",
    },
    red: {
      main: '#BA0000',
      contrastText: '#FFF'
    }
  },

  typography: {
    fontFamily: "Verdana, sans-serif", // Your preferred font family
    fontSize: 16, // Base font size
  },
  // Other theme options (spacing, breakpoints, etc.)
});

export const AuthContext = React.createContext();

function useAuth(i = null) {
  const init = (input) => {
    if(!input)
      return null;
    if (typeof input !== "string") {
      sUser(input);
    } else {
      sUser(JSON.parse(input));
    }
  }
  const [user, sUser] = useState(i ? init(i) : localStorage.getItem("user"));

  useEffect(() => {
    if(!user)
      localStorage.removeItem('user');
    else
      localStorage.setItem('user', JSON.stringify(user));
  }, [user])

  const getUser = () => {
      return user ? user : null;
  }
  const isAuthenticated = () => {
    return user ? true : false;
  }
  const logout = () => {
    sUser(null);
  }

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

  let auth = useAuth()

  let configs = [
    configDefault,
    configGraph,
    configJordi,
  ];

  function swapConfig() {
    const currentIndex = configs.findIndex(c => c === config);
    const nextIndex = (currentIndex + 1) % configs.length;
    setConfig(configs[nextIndex]);
  }

  return (
    <ThemeProvider theme={theme}>
      <ConfigContext.Provider value={{config, swapConfig}}>
      <AuthContext.Provider value={auth}>
        <Nav />
        <Particles />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/game/:category" element={<Game />} />
          <Route path="/endgame/" element={<Endgame />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </AuthContext.Provider>
      </ConfigContext.Provider>
    </ThemeProvider>
  );
}
