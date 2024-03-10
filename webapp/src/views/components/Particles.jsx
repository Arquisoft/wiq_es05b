import React, { useEffect } from 'react';
import 'particles.js';
import config from "./config/particles-config";
const particlesJS = window.particlesJS;

export default function Particles() {

    useEffect(() => {
        particlesJS('particles-js', config);
    }, []);

    return <div 
      id="particles-js"
      style={{
        position: "fixed", 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, 
        zIndex: -1
      }}
    ></div>;

};

