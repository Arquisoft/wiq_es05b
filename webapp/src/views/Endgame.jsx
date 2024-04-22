import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export default function Endgame({points, correct, wrong, time}) {
    return (
        <Container maxWidth="md" sx={{paddingTop: '2rem'}}>
            <Paper elevation={3} sx={{padding: '2rem', textAlign: "center", display: "flex", flexFlow: "column", gap: "1rem"}}>
                <img src="/jordi-celebration.png" alt="Ou yea"/>
                <Typography variant="h4" component="p">Game result</Typography> {/* TODO - change i18n */}
                <Typography variant="h5" component="p">Total points: {points}</Typography> {/* TODO - change i18n */}
                <Typography variant="h5" component="p">Correct answers: {correct}</Typography> {/* TODO - change i18n */}
                <Typography variant="h5" component="p">Wrong answers: {wrong}</Typography> {/* TODO - change i18n */}
                <Typography variant="h5" component="p">Total time: {time} s</Typography> {/* TODO - change i18n */}
                <Button component={Link} to="/home" variant="contained">Go Home</Button> {/* TODO - change i18n */}
            </Paper>
        </Container>
    )
}