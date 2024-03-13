import React from 'react';
import ReactDOM from 'react-dom/client';
import {Route, Routes} from "react-router";
import {BrowserRouter} from "react-router-dom";

import reportWebVitals from './scripts/reportWebVitals';
import Home from './views/Home';
import Nav from "./views/components/Nav";
import Footer from "./views/components/Footer";
import Login from "./views/Login"
import Signup from "./views/Signup"
import About from "./views/About"
import Ranking from "./views/Ranking"
import Menu from "./views/Menu";
import Game from "./views/Game";
import Account from "./views/Account";

import Particles from "./views/components/Particles"

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e3487', // Your primary color
      contrastText: '#FFF'
    },
    dark: {
        main: '#0f0f5e',
        contrastText: '#F2F2F2'
    },
    light: {
        main: '#5e86cf',
        contrastText: '#F2F2F2'
    },
    red: {
      main: '#BA0000',
      contrastText: '#FFF'
    }
  },

  typography: {
    fontFamily: 'Verdana, sans-serif', // Your preferred font family
    fontSize: 16, // Base font size
  },
  // Other theme options (spacing, breakpoints, etc.)
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
        <Nav/>
        <Particles/>
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/ranking" element={<Ranking/>} />
            <Route path="/menu" element={<Menu/>} />
            <Route path="/game/:category" element={<Game/>} />
            <Route path="/account" element={<Account/>} />
            <Route path="*" element={<Home/>} />
        </Routes>
        <Footer/>
        </ThemeProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

reportWebVitals();

export default App;