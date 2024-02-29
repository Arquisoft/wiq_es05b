import React, { useEffect } from 'react';
import 'particles.js';
import config from "./config/particles-config";
const particlesJS = window.particlesJS;

export default function Particles() {

    useEffect(() => {
        particlesJS('particles-js', config);
    }, []);

    return <div id="particles-js" style={{
        position: "absolute",
        height: "90%",
        width: "100%",
        background: "rgba(255, 255, 255)",
        filter: "blur(2px)"}}></div>;

};
