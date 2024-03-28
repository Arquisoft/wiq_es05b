import { Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ProtectedComponent from "./components/ProtectedComponent";
import grave from "../media/graveJordi.svg";
import ServiceDownMessage from "./components/ServiceDownMessage";

const buttonConfig = {
  width: "9rem",
  height: "5rem",
};

const buttonGroup = {
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "space-evenly",
  margin: "1rem 0",
  gap: "1rem",
};

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const MyButton = ({ text, link }) => (
  <Button variant="contained" sx={buttonConfig} component={Link} to={link}>
    {text}
  </Button>
);

const Buttons = ({ categories }) => {
  if (!categories || categories.length === 0)
    return <ServiceDownMessage grave={grave} />;
  return (
    <Container>
      <Typography variant="h5" component="p">
        Choose a category to play
      </Typography>
      <Container sx={buttonGroup}>
        {categories.map((category, i) => (
          <MyButton key={i} text={category} link={"/game/" + category} />
        ))}
      </Container>
    </Container>
  );
};

export default function GameMenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${apiEndpoint}/categories`)
      .then((response) => {
        // FIXME - Modify backend to return another status code rather than 200 to prevent app crash
        if (response) setCategories(response.data);
      });
  }, []);

  return (
    <>
      <ProtectedComponent />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
        }}
      >
        <Paper
          elevation={3}
          sx={{ margin: "2rem 0", padding: "1rem", textAlign: "center" }}
        >
          <Typography variant="h3" component="p" sx={{ marginBottom: "2rem" }}>
            Menu
          </Typography>
          <Buttons categories={categories} />
        </Paper>
      </Container>
    </>
  );
}
