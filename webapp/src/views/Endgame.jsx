import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export default function Endgame({points, correct, wrong, time}) {
    return (
        <Container maxWidth="md" sx={{paddingTop: '2rem'}}>
            <Paper elevation={3} sx={{padding: '2rem', textAlign: "center", display: "flex", flexFlow: "column", gap: "1rem"}}>
                <img src="/jordi-celebration.png" alt="Ou yea"/>
                <Typography variant="h4" component="p">Game result</Typography>
                <Typography variant="h5" component="p">Total points: {points}</Typography>
                <Typography variant="h5" component="p">Correct answers: {correct}</Typography>
                <Typography variant="h5" component="p">Wrong answers: {wrong}</Typography>
                <Typography variant="h5" component="p">Total time: {time} s</Typography>
                <Button component={Link} to="/home" variant="contained">Go Home</Button>
            </Paper>
        </Container>
    )
}