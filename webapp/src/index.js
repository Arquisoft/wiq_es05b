import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './scripts/reportWebVitals';
import App from './App';
import axios from 'axios';

const sslApiEndpoint = process.env.REACT_APP_API_ENDPOINT_SSL || 'https://localhost:7999';
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const interceptor = (config) => {
  const protocol = window.location.protocol

  config.url = protocol === 'https:' ?
    config.url.replace(apiEndpoint, sslApiEndpoint) :
    config.url.replace(sslApiEndpoint, apiEndpoint);
}

axios.defaults.baseURL = sslApiEndpoint
axios.interceptors.request.use(interceptor, (e) => Promise.reject(e))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

reportWebVitals();
