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
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Particles from "./views/components/Particles";
import React, { useState, useEffect } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e3487", // Your primary color
      contrastText: "#FFF",
    },
    dark: {
      main: "#0f0f5e",
      contrastText: "#F2F2F2",
    },
    light: {
      main: "#5e86cf",
      contrastText: "#F2F2F2",
    },
  },

  typography: {
    fontFamily: "Verdana, sans-serif", // Your preferred font family
    fontSize: 16, // Base font size
  },
  // Other theme options (spacing, breakpoints, etc.)
});

export const AuthContext = React.createContext();

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  useEffect(() => {
    if(!user)
      localStorage.removeItem('user');
    else
      localStorage.setItem('user', user);
  }, [user])

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{user: user, setUser:setUser}}>
        <Nav />
        <Particles />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/game/:category" element={<Game />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
