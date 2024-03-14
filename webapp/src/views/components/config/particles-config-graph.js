const config = {
    "particles": {
    "number": {
        "value": 70,
            "density": {
            "enable": true,
                "value_area": 800
        }
    },
    "color": {
        "value": "#000000"
    },
    "shape": {
        "type": "circle",
            "stroke": {
            "width": 0,
                "color": "#000000"
        },
        "polygon": {
            "nb_sides": 3
        },
        "image": {
            "src": "img/github.svg",
                "width": 100,
                "height": 100
        }
    },
    "opacity": {
        "value": 0.5,
            "random": false,
            "anim": {
            "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
        }
    },
    "size": {
        "value": 6,
            "random": true,
            "anim": {
            "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
        }
    },
    "line_linked": {
        "enable": true,
            "distance": 150,
            "color": "#104280",
            "opacity": 0.4,
            "width": 3
    },
    "move": {
        "enable": true,
            "speed": 1,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
            "enable": false,
                "rotateX": 600,
                "rotateY": 1200
        }
    }
},
    "retina_detect": true
}

export default config;