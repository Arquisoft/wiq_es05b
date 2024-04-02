import { Avatar, Container, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import grave from "../media/graveRanking.svg";
import Loader from "./components/Loader";
import ServiceDownMessage from "./components/ServiceDownMessage";

const RankingList = ({ scores }) => {
  // TODO - Maybe add loader and ServiceDownMessage move to <Ranking> in the catch block of the promise
  if (!scores || scores.length === 0)
    return <ServiceDownMessage grave={grave} />
  return (
    <List>
      {scores.map((score, index) => (
        <ListItem key={score.id}>
          <ListItemAvatar>
            <Avatar>{index + 1}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={score.name}
            secondary={`Score: ${score.points}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default function Ranking() {

  const [scores, setScores] = useState([]);
  const [init, setInit] = useState(false); //To prevent error message from showing while fetching

  // Fetch the top 10 users at first render
  useEffect(() => {
    axios.get(`/ranking/10`)
      .then((response) => {
        setScores(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setInit(true);
      });

  }, []);

  if (!init)
    return <Loader />
  else
    return (
      <Container style={{ paddingTop: "2rem" }}>
        <Paper
          elevation={3}
          style={{ padding: 16, margin: "auto", maxWidth: 400 }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Global Ranking
          </Typography>
          <RankingList scores={scores} />
        </Paper>
      </Container>
    );
}
