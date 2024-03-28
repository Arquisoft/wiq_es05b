import { Container, Typography } from "@mui/material";

const ServiceDownMessage = ({ grave }) => {
  return (
    <Container sx={{display: "flex", flexFlow: "column", textAlign: "center"}}>
      <img src={grave} alt="Grave" style={{width:"40%", alignSelf: "center"}} />
      <Typography variant="h6" component="p" sx={{ margin: "1rem" }}>
        The service seems to be down, please try again later.
      </Typography>
    </Container>
  );
};

export default ServiceDownMessage;
