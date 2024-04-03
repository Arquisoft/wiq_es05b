import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Endgame() {
    const location = useLocation();
    const points = location.state?.points;
    const correct = location.state?.correct;
    const wrong = location.state?.wrong;
    const time = convertirTiempo(location.state?.time);
    function convertirTiempo(time) {
        const sec = Math.round(time/ 1000);
        const min = Math.round(sec/60);
        const minFormat = String(min).padStart(2, '0');
        const secFormat = String(sec).padStart(2, '0');

        return `${minFormat}:${secFormat}`;
    }
    return (
        <Container maxWidth="md" sx={{paddingTop: '2rem'}}>
            <Paper elevation={3} sx={{padding: '2rem', textAlign: "center", display: "flex", flexFlow: "column", gap: "1rem"}}>
                <img src="/jordi-celebration.png" alt="Ou yea"/>
                <Typography variant="h4" component="p">Game result</Typography>
                <Typography variant="h5" component="p">Total points: {points}</Typography>
                <Typography variant="h5" component="p">Correct answers: {correct}</Typography>
                <Typography variant="h5" component="p">Wrong answers: {wrong}</Typography>
                <Typography variant="h5" component="p">Total time: {time}</Typography>
                <Button component={Link} to="/home" variant="contained">Go Home</Button>
            </Paper>
        </Container>
    )
}