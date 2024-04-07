import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './scripts/reportWebVitals';
import App from './App';
import axios from 'axios';

const sslApiEndpoint = process.env.REACT_APP_API_ENDPOINT_SSL || 'http://localhost:8000';
axios.defaults.baseURL = sslApiEndpoint

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
reportWebVitals();
