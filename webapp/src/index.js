import React from 'react';
import ReactDOM from 'react-dom/client';
import {Route, Routes} from "react-router";
import {BrowserRouter} from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import Home from './views/Home';
import Nav from "./views/components/Nav";
import Footer from "./views/components/Footer";
import Login from "./views/Login"
import Signup from "./views/Signup"
import About from "./views/About"
import Ranking from "./views/Ranking"
import GameMenu from "./views/GameMenu";
import GameView from "./views/GameView";
import Account from "./views/Account";


import Particles from "./views/components/Particles"

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#055902', // Your primary color
      contrastText: '#FFF'
    },
    darkGreen: {
        main: '#034001',
        contrastText: '#F2F2F2'
    },
    lightGreen: {
        main: '#86A656',
        contrastText: '#F2F2F2'
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
            <Route path="/menu" element={<GameMenu/>} />
            <Route path="/play" element={<GameView/>} />
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