import React from "react";
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Container } from "@mui/material";
import grave from "../media/graveRanking.svg"
import ServiceDownMessage from "./components/ServiceDownMessage";

// TODO - Recover users from the API
const users = [
  { id: 1, name: "John Doe", score: 150 },
  { id: 2, name: "Jane Smith", score: 120 },
  { id: 3, name: "Bob Johnson", score: 100 },
  { id: 4, name: "Alice Lee", score: 90 },
];

const RankingList = ({ users }) => {
  // TODO - Maybe add loader and ServiceDownMessage move to <Ranking> in the catch block of the promise
  if (!users || users.length === 0)
    return <ServiceDownMessage grave={grave} />
  return (
    <List>
      {users.map((user, index) => (
        <ListItem key={user.id}>
          <ListItemAvatar>
            <Avatar>{index + 1}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={`Score: ${user.score}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default function Ranking() {
  return (
    <Container style={{ paddingTop: "2rem" }}>
      <Paper
        elevation={3}
        style={{ padding: 16, margin: "auto", maxWidth: 400 }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Global Ranking
        </Typography>
        <RankingList users={users} />
      </Paper>
    </Container>
  );
}
