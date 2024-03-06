import React from 'react';
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Container } from '@mui/material';

const users = [
    { id: 1, name: 'John Doe', score: 150 },
    { id: 2, name: 'Jane Smith', score: 120 },
    { id: 3, name: 'Bob Johnson', score: 100 },
    { id: 4, name: 'Alice Lee', score: 90 },
];

export default function Ranking() {
    return (

        <Container style={{paddingTop: '2rem'}}>
            <Paper elevation={3} style={{ padding: 16, maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                User Ranking
            </Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={user.id}>
                        <ListItemAvatar>
                            <Avatar>{index + 1}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={`Score: ${user.score}`} />
                    </ListItem>
                ))}
            </List>
            </Paper>
        </Container>  
    );
}