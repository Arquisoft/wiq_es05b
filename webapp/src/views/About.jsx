import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from "../media/logoL.svg";
import Card from "./components/Card";
import { LocaleContext } from "./context/LocaleContext";

const FirstCard = () => {
  const { t } = useContext(LocaleContext)
  return (
    <Paper elevation={3} sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>{t("about_title")}</Typography>

      <Container className="svg-container" sx={{ textAlign: "center", margin: "1rem" }}>
        <Logo style={{ width: '75%', height: '75%' }} />
      </Container>

      <Typography variant="body1" paragraph>{t("about_p1")}</Typography>
      <Typography variant="body1" paragraph>{t("about_p2")}</Typography>
      <Typography variant="body1" paragraph>{t("about_p3")}</Typography>
      <Typography variant="body1" paragraph>{t("about_p4")}</Typography>
      <Typography variant="subtitle1" color="textSecondary">{t("about_p5")}</Typography>
    </Paper>
  )
}

const ContactCard = ({ mails }) => {
  const { t } = useContext(LocaleContext)
  return (
    <Paper elevation={3} sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>{t("about_contact_us")}</Typography>
      <Typography variant="body1" paragraph>{t("about_contact_channels")}</Typography>
      {mails.map((mail, i) => {
        return (
          <Typography key={`mail${i}`} variant="body1" paragraph>
            {t("about_mailing")} <Link href={`mailto:${mail}`}>{mail}</Link>
          </Typography>
        )
      })}
      <Typography variant="subtitle1">
        <Link href="https://github.com/Arquisoft/wiq_es05b" target="_blank" rel="noopener noreferrer">
          {t("about_github")}</Link>
      </Typography>
    </Paper>
  )
}

export default function About() {
  const { t } = useContext(LocaleContext)
  const mails = [
    "uo289295@uniovi.es",
    "uo288787@uniovi.es",
    "uo276255@uniovi.es",
    "uo289321@uniovi.es",
    "uo288705@uniovi.es"
  ]

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', display: "flex", gap: "2rem", flexFlow: "column", alignItems: "center" }}>

      <Card width={'94%'} height={'550px'} title={'About the project'} image={'twcard.png'} imageHeigth={'45%'} lines={[
        t("about_p1"),
        t("about_p2"),
        t("about_p3"),
        t("about_p4")
      ]} />
      <Box sx={{ display: 'flex', gap: '2rem', flexFlow: 'row wrap', justifyContent: 'center', width: '100%' }}>
        <Card link={"https://github.com/Arquisoft/wiq_es05b"} width={'45%'} height={'300px'} title={'About the app'} image={'about-git.jpg'} imageHeigth={'50%'} lines={['Check our github here!']} />
        <Card link={"/howTo"} width={'45%'} height={'300px'} title={'About the game'} image={'about-guide.jpg'} imageHeigth={'50%'} lines={['Check our guide to play here!']} />
      </Box>
      <Card link={"https://www.rtve.es/play/videos/saber-y-ganar/"} width={'94%'} height={'500px'} title={'About the program'} image={'about-jordi.jpg'} imageHeigth={'65%'} lines={['This app is inspired in the spanish TV show "Saber y Ganar"', "Don't forget to take a look here"]} />

    </Container>
  );
}
