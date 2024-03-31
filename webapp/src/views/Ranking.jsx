import { Avatar, Container, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import grave from "../media/graveRanking.svg";
import ServiceDownMessage from "./components/ServiceDownMessage";


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

  const [users, setUsers] = useState([]);

  // Fetch the top 10 users at first render
  useEffect(() => {
    const response = axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ranking/10`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
