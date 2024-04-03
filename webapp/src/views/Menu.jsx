import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import grave from "../media/graveJordi.svg";
import Loader from "./components/Loader";
import ProtectedComponent from "./components/ProtectedComponent";
import ServiceDownMessage from "./components/ServiceDownMessage";

const buttonConfig = {
  width: "9rem",
  height: "5rem",
};

const buttonGroup = {
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "space-evenly",
  margin: "2rem 0",
  gap: "1rem",
};

const categorySearch = {
  marginTop: "1rem"
}

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const MyButton = ({ text, link }) => (
  <Button variant="contained" sx={buttonConfig} component={Link} to={link}>
    {text}
  </Button>
);

const Buttons = ({ categories }) => {
  const [filter, setFilter] = useState('');

  if (!categories || categories.length === 0) return <Loader />

  let filteredCategories = categories;
  if (filter !== '' && filter.trim().length > 0)
    filteredCategories = categories.filter(category =>
      category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Container>

      <Typography variant="h5" component="p">
        Choose a category to play
      </Typography>

      <TextField sx={categorySearch} label="Search categories..." variant="standard" onChange={(e) => setFilter(e.target.value)} />

      <Container sx={buttonGroup}>
        {filteredCategories.map((category, i) => (
          <MyButton key={i} text={category} link={"/game/" + category} />
        ))}
      </Container>
    </Container>
  );
};

export default function GameMenu() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${apiEndpoint}/categories`)
      .then((response) => {
        if (response) setCategories(response.data);
      })
      .catch((error) => setError({ code: error.response.status, message: error.response.data.error }));
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
          {
            error ?
              <ServiceDownMessage grave={grave} code={error.code} reason={error.message} /> :
              <Buttons categories={categories} />
          }
        </Paper>
      </Container>
    </>
  );
}
