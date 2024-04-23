import { Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {useContext} from "react";
import {LocaleContext} from "./context/LocaleContext";

export default function Error() {
  const { t } = useContext(LocaleContext)
  return (
    <Container maxWidth="md" sx={{ paddingTop: "2rem" }}>
      <Paper elevation={3} sx={{
        padding: "2rem",
        textAlign: "center",
        display: "flex",
        flexFlow: "column",
        gap: "1rem",
      }}>
        <img src="/jordi-error.jpg" alt="Oh no" />
        <Typography variant="h4" component="p">{t("error_occurred")}</Typography>
        <Typography variant="h5" component="p">{t("error_bad_request")}</Typography>
        <Typography variant="h5" component="p">{t("error_sinner")}</Typography>
        <Button component={Link} to="/home" variant="contained">{t("error_home_button")}</Button>
      </Paper>
    </Container>
  );
}
