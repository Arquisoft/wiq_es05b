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

const App = () => {
    return (
        <Fragment>
            <Nav/>
            <Routes>
                <Route path="/home" element={<Home/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/ranking" element={<Ranking/>} />
                <Route path="*" element={<Home/>} />
            </Routes>
            <Footer/>       
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
