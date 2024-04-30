import { Box, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Card(props) {
    const { width, height, image, title, lines, imageHeigth,link } = props;

    const cardStyle = {
        textTransform: 'none',
        textDecoration: 'none',
        width: width,
        height: height,
        transition: 'transform .5s',
        '&:hover': {
            transform: 'scale(1.05)',
        },
        '&:hover img': {
            transform: 'scale(1.05)',
        },
        overflow: 'hidden',
    }

    const imageStyle = {
        width: '100%',
        height: imageHeigth,
        //Animation to scale the image on hover
        transition: 'transform .2s',
        '&:hover': {
            transform: 'scale(1.1)',
        }
    }

    return (
        <Paper elevation={3} sx={cardStyle}>
            <Link to={link} sx={{ textDecoration: 'none' }}>
                <img src={image} alt="img" style={imageStyle} />
            </Link>
            <Box sx={{ padding: '2rem', height: '30%' }}>
                <Typography variant="h5" component="h2" sx={{ marginBottom: '.5em' }}> {title}  </Typography>
                {lines.map((line, i) => (
                    <Typography key={i} variant="body1" component="p" > {line} </Typography>
                ))}
            </Box>
        </Paper>
    );
}