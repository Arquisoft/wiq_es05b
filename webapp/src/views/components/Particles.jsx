import React, { useEffect } from 'react';
import 'particles.js';
import config from "./config/particles-config";
const particlesJS = window.particlesJS;

export default function Particles() {

    useEffect(() => {
        particlesJS('particles-js', config);
    }, []);

    return <div id="particles-js" 
    style={{
        position: "absolute",
        top: "10%",
        height: "85%",
        width: "100%",
        backgroundColor: "#e2e9ff",
        zIndex: -1,
    }}
        ></div>;

};

