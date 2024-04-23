import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import grave from "../media/graveJordi.svg";
import Loader from "./components/Loader";
import ProtectedComponent from "./components/ProtectedComponent";
import ServiceDownMessage from "./components/ServiceDownMessage";
import {AuthContext} from "./context/AuthContext";
import {LocaleContext} from "./context/LocaleContext";

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

const MyButton = ({ text, link }) => (
  <Button variant="contained" sx={buttonConfig} component={Link} to={link} role="button">
    {text}
  </Button>
);

const Buttons = ({ categories }) => {
  const [filter, setFilter] = useState('');
  const { t } = useContext(LocaleContext);

  if (!categories || categories.length === 0) return <Loader />

  let filteredCategories = categories;
  if (filter !== '' && filter.trim().length > 0)
    filteredCategories = categories.filter(category =>
      category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Container>

      <Typography variant="h5" component="p">
        {t("menu_choose")}
      </Typography>

      <TextField sx={categorySearch} label={t("menu_search_placeholder")} variant="standard" onChange={(e) => setFilter(e.target.value)} />

      <Container sx={buttonGroup}>
        {filteredCategories.map((category, i) => (
          <MyButton key={i} text={category} link={"/game/" + category} />
        ))}
      </Container>
    </Container>
  );
};

export default function GameMenu() {
  const { getUser, isAuthenticated } = useContext(AuthContext)
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useContext(LocaleContext);

  useEffect(() => {
    if(!isAuthenticated()) return;
    axios.get(`/game/categories`, { headers: { Authorization: `Bearer ${getUser().token}` } })
      .then((response) => {
        if (response) setCategories(response.data);
      })
      .catch((error) => setError({ code: error.response.status, message: error.response.data.error }));
      //eslint-disable-next-line
  }, []);

  return (
    <ProtectedComponent>
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
            {t("menu_title")}
          </Typography>
          {
            error ?
              <ServiceDownMessage grave={grave} code={error.code} reason={error.message} /> :
              <Buttons categories={categories} />
          }
        </Paper>
      </Container>
    </ProtectedComponent>
  );
}
