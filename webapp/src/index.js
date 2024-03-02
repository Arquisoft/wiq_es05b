import React from 'react';
import ReactDOM from 'react-dom/client';
import {Fragment} from 'react';
import {Route, Routes} from "react-router";
import {BrowserRouter} from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import Home from './Home';
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Login from "./Login"
import Signup from "./Signup"
import About from "./About"
import Ranking from "./Ranking"

import Particles from "./components/Particles"

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#055902', // Your primary color
    },
  },

  typography: {
    fontFamily: 'Verdana, sans-serif', // Your preferred font family
    fontSize: 16, // Base font size
  },
  // Other theme options (spacing, breakpoints, etc.)
});

const App = () => {
    return (
        <Fragment>
            <ThemeProvider theme={theme}>
            <Nav/>
            <Particles/>
            <Routes>
                <Route path="/home" element={<Home/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/ranking" element={<Ranking/>} />
                <Route path="*" element={<Home/>} />
            </Routes>
            <Footer/>   
            </ThemeProvider>    
        </Fragment>
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