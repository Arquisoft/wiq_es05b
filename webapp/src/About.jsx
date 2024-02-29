import React from 'react';
import { Container, Typography, Paper, Link } from '@mui/material';

export default function About() {
    return (
        <Container maxWidth="md" style={{ marginTop: '2rem'}}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to our project! We are dedicated to providing quality content and services to our users.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our mission is to provide a fun way of learning and practicing general knowledge through a Q&A game.
                </Typography>
                <Typography variant="body1" paragraph>
                    Feel free to explore our site and discover more about what we have to offer.
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions or feedback, please don't hesitate to contact us.
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Thank you for visiting!
                </Typography>
            </Paper>

            <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem', height: '50rem' }}>
                <Typography variant="h4" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    You can reach us via the following channels:
                </Typography>
                <Typography variant="body1" paragraph>
                    GitHub: <Link href="https://github.com/Arquisoft/wiq_es05b" target="_blank" rel="noopener noreferrer">Checkout our github page!</Link>
                </Typography>
                <Typography variant="body1" paragraph>
                    Mailing Info: <Link href="mailto:UO288787@uniovi.es">uo288787@uniovi.es</Link>
                </Typography>
            </Paper>

        </Container>
        
    );
}
