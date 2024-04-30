import React, {useContext} from 'react';
import {Container, Typography, Paper} from '@mui/material';
import {LocaleContext} from "./context/LocaleContext";
const NavigateCard = () => {
    const { t } = useContext(LocaleContext)
    return (

        <Paper elevation={3} sx={{padding: '2rem'}}>

            <Typography variant="h4" gutterBottom>{t("howto_n_title")}</Typography>

            <Typography variant="body1" paragraph>{t("howto_n1")}</Typography>
            <Typography variant="body1" paragraph>{t("howto_n2")}</Typography>
            <Typography variant="body1" paragraph>{t("howto_n3")}</Typography>
        </Paper>
    )
}

const GameCard = () => {
    const { t } = useContext(LocaleContext)
    return (
        <Paper elevation={3} sx={{padding: '2rem'}}>
            <Typography variant="h4" gutterBottom>{t("howto_g_title")}</Typography>

            <Typography variant="body1" paragraph>{t("howto_g1")}</Typography>
            <Typography variant="body1" paragraph>{t("howto_g2")}</Typography>
            <Typography variant="body1" paragraph>{t("howto_g3")}</Typography>
            <Typography variant="body1" paragraph>{t("howto_g4")}</Typography>
        </Paper>
    )
}

const ExtraCard = () => {
    const { t } = useContext(LocaleContext)
    return (
        <Paper elevation={3} sx={{padding: '2rem'}}>
            <Typography variant="body1" paragraph>{t("howto_summary")}</Typography>
        </Paper>
    )
}

export default function HowToPlay() {
    const { t } = useContext(LocaleContext)
    return (
    <Container maxWidth="md" sx={{marginTop: '2rem', display: "flex", gap: "2rem", flexFlow: "column"}}>
        <Container className="svg-container" sx={{textAlign: "center", margin: "1rem"}}>
            <Typography variant="h3" gutterBottom>{t("howto_title")}</Typography>
        </Container>
        <NavigateCard />
            <GameCard />
        <ExtraCard></ExtraCard>
        </Container>
    );
}
