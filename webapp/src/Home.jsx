import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import Particles from "./components/Particles";
import {Fragment} from "react";


function Home() {

    const shadowConfig = "7px 7px 16px"
    const buttonConfig = {margin: "1rem", width: "10em", height: "4em"}

    return(
        <Fragment>
            <Particles />
            <Container sx={{
                position: "absolute",
                height: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"}}
            >
                <Typography component="p" sx={{
                    textShadow: shadowConfig,
                    fontSize: {xs: "h5.fontSize", md: "h4.fontSize"}}}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius placerat mi, vitae ornare odio.
                </Typography>
                <Typography component="p" sx={{
                    textShadow: shadowConfig,
                    fontSize: {md: "h5.fontSize"}}}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius placerat mi, vitae ornare odio.
                </Typography>
                <Container>
                    <Button variant="contained" sx={buttonConfig}>Play</Button>
                    <Button variant="contained" sx={buttonConfig}>Register</Button>
                </Container>
            </Container>
        </Fragment>
    )
}

export default Home;