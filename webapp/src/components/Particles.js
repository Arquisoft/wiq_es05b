import React, { useEffect } from 'react';
import 'particles.js';
import config from "./config/particles-config";
const particlesJS = window.particlesJS;

const Particles = () => {
    useEffect(() => {
        particlesJS('particles-js', config);
    }, []);

    return <div id="particles-js" style={{
        position: "absolute",
        height: "99%",
        width: "100%",
        background: "rgba(0, 0, 0, 0.1)",
        filter: "blur(2px)"}}></div>;
};

export default Particles;
