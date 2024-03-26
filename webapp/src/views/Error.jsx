import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export default function Error() {
    return (
        <Container maxWidth="md" sx={{paddingTop: '2rem'}}>
            <Paper elevation={3} sx={{ padding: '2rem', textAlign: "center", display: "flex", flexFlow: "column",  gap: "1rem" }}>
                <img src="/jordi-error.jpg" alt="Oh no"/>
                <Typography variant="h4" component="p">Oh no, an error occurred.</Typography>
                <Typography variant="h5" component="p">It seems the requested URL does no exist or you don't have enough privileges to see it.</Typography>
                <Typography variant="h5" component="p">Go back sinner.</Typography>
                <Button component={Link} to="/home" variant="contained">Go Home</Button>
            </Paper>
        </Container>
    )
}