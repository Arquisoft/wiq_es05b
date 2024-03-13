import React, { useEffect, useContext } from 'react';
import 'particles.js';
import { ConfigContext } from '../context/ConfigContext';

const particlesJS = window.particlesJS;

export default function Particles() {

    const { config } = useContext(ConfigContext);

    useEffect(() => {
        particlesJS('particles-js', config);
    }, [config]);

    return (
        <div
            id="particles-js"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1
            }}
        >
        </div>
    );

};

