import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Endgame() {
    const location = useLocation();
    const correct = location.state?.correct;
    const wrong = location.state?.wrong;
    const time = convertirTiempo(location.state?.time);
    function convertirTiempo(time) {
        // Calcula horas, minutos y segundos
        const segundos = Math.round(time/ 100);
        const minutos = Math.round(segundos/60);
        const minutosFormateados = String(minutos).padStart(2, '0');
        const segundosFormateados = String(segundos).padStart(2, '0');

        return `${minutosFormateados}:${segundosFormateados}`;
    }
    return (
        <Container maxWidth="md" sx={{paddingTop: '2rem'}}>
            <Paper elevation={3} sx={{ padding: '2rem', textAlign: "center", display: "flex", flexFlow: "column",  gap: "1rem" }}>
                <Typography variant="h5" component="p">Correct answers: {correct}</Typography>
                <Typography variant="h5" component="p">Wrong answers: {wrong}</Typography>
                <Typography variant="h5" component="p">Total time: {time}</Typography>
                <Button component={Link} to="/home" variant="contained">Go Home</Button>
            </Paper>
        </Container>
    )
}