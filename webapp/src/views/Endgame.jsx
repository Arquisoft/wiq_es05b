import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {LocaleContext} from "./context/LocaleContext";

export default function Endgame({points, correct, wrong, time}) {
    const { t } = useContext(LocaleContext)
    return (
        <Container maxWidth="md" sx={{paddingTop: '2rem'}}>
            <Paper elevation={3} sx={{padding: '2rem', textAlign: "center", display: "flex", flexFlow: "column", gap: "1rem"}}>
                <img src="/jordi-celebration.png" alt="Ou yea"/>
                <Typography variant="h4" component="p">{t("endgame_result")}</Typography>
                <Typography variant="h5" component="p">{t("endgame_points")} {points}</Typography>
                <Typography variant="h5" component="p">{t("endgame_correct")} {correct}</Typography>
                <Typography variant="h5" component="p">{t("endgame_wrong")} {wrong}</Typography>
                <Typography variant="h5" component="p">{t("endgame_time")} {time} s</Typography>
                <Button component={Link} to="/home" variant="contained">{t("endgame_home_button")}</Button>
            </Paper>
        </Container>
    )
}