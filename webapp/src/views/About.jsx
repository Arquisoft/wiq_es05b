import React, {useContext} from 'react';
import {Container, Typography, Paper, Link} from '@mui/material';
import {ReactComponent as Logo} from "../media/logoL.svg";
import {LocaleContext} from "./context/LocaleContext";

const FirstCard = () => {
  const { t } = useContext(LocaleContext)
  return (
    <Paper elevation={3} sx={{padding: '2rem'}}>
      <Typography variant="h4" gutterBottom>{t("about_title")}</Typography>

      <Container className="svg-container" sx={{textAlign: "center", margin: "1rem"}}>
        <Logo style={{width: '75%', height: '75%'}} />
      </Container>

      <Typography variant="body1" paragraph>{t("about_p1")}</Typography>
      <Typography variant="body1" paragraph>{t("about_p2")}</Typography>
      <Typography variant="body1" paragraph>{t("about_p3")}</Typography>
      <Typography variant="body1" paragraph>{t("about_p4")}</Typography>
      <Typography variant="subtitle1" color="textSecondary">{t("about_p5")}</Typography>
    </Paper>
  )
}

const ContactCard = ({mails}) => {
  const { t } = useContext(LocaleContext)
  return (
    <Paper elevation={3} sx={{padding: '2rem'}}>
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
  const mails = [
    "uo289295@uniovi.es",
    "uo288787@uniovi.es",
      "uo276255@uniovi.es",
      "uo289321@uniovi.es",
      "uo288705@uniovi.es"
  ]

  return (
    <Container maxWidth="md" sx={{marginTop: '2rem', display: "flex", gap: "2rem", flexFlow: "column"}}>
      <FirstCard />
      <ContactCard mails={mails} />
    </Container>

  );
}
