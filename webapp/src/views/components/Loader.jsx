import { Box, CircularProgress, Container, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Container sx={{ display: "flex", flexFlow: "column", textAlign: "center" }}>
      <Typography variant="h6" component="p" sx={{ margin: "1rem" }}>
        Loading, please wait...
      </Typography>
      <Box sx={{marginBottom: "1rem"}}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default Loader;
