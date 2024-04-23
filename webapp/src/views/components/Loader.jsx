import { Box, CircularProgress, Container, Typography } from "@mui/material";
import {useContext} from "react";
import {LocaleContext} from "../context/LocaleContext";

const Loader = () => {
  const { t } = useContext(LocaleContext);
  return (
    <Container sx={{ display: "flex", flexFlow: "column", textAlign: "center" }}>
      <Typography variant="h6" component="p" sx={{ margin: "1rem" }}>
        {t("loader_msg")}
      </Typography>
      <Box sx={{marginBottom: "1rem"}}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default Loader;
