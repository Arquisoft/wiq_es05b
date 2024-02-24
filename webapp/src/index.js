import React, {Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Home from './Home';
import reportWebVitals from './reportWebVitals';
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Fragment> {/* This should go to App */}
          <Nav />
          <Home />
          <Footer />
      </Fragment>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
