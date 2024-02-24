import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";

function Home() {
    return(
        <Container sx={{height: 1}}>
            <div style={{textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%"}}>
                <Typography component="p" sx={{fontSize: {xs: "h5.fontSize", md: "h4.fontSize"}}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius placerat mi, vitae ornare odio.</Typography>
                <Typography component="p" sx={{fontSize: {md: "h5.fontSize"}}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius placerat mi, vitae ornare odio.</Typography>
                <Container>
                    <Button variant="contained" sx={{margin: "1rem", width: "10em", height: "4em"}}>Play</Button>
                    <Button variant="contained" sx={{margin: "1rem", width: "10em", height: "4em"}}>Register</Button>
                </Container>
            </div>
        </Container>
    )
}

export default Home;