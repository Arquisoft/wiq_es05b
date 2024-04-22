import React from 'react';
import {Container, Typography, Paper, Link} from '@mui/material';
import {ReactComponent as Logo} from "../media/logoL.svg";

const FirstCard = () => {
  return (
    <Paper elevation={3} sx={{padding: '2rem'}}>
      <Typography variant="h4" gutterBottom>
        About Us {/* TODO - change i18n */}
      </Typography>

      <Container className="svg-container" sx={{textAlign: "center", margin: "1rem"}}>
        <Logo style={{width: '75%', height: '75%'}} />
      </Container>

      <Typography variant="body1" paragraph>
        {/* TODO - change i18n */}
        Welcome to our project! We are dedicated to providing quality content and services to our users.
      </Typography>
      <Typography variant="body1" paragraph>
        {/* TODO - change i18n */}
        Our mission is to provide a fun way of learning and practicing general knowledge through a Q&A game.
      </Typography>
      <Typography variant="body1" paragraph>
        {/* TODO - change i18n */}
        Feel free to explore our site and discover more about what we have to offer.
      </Typography>
      <Typography variant="body1" paragraph>
        {/* TODO - change i18n */}
        If you have any questions or feedback, please don't hesitate to contact us.
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {/* TODO - change i18n */}
        Thank you for visiting!
      </Typography>
    </Paper>
  )
}

const ContactCard = ({mails}) => {
  return (
    <Paper elevation={3} sx={{padding: '2rem'}}>
      <Typography variant="h4" gutterBottom>
        {/* TODO - change i18n */}
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        {/* TODO - change i18n */}
        You can reach us via the following channels:
      </Typography>
      {mails.map((mail, i) => {
        return (
          <Typography key={`mail${i}`} variant="body1" paragraph>
            {/* TODO - change i18n */}
            Mailing Info: <Link href={`mailto:${mail}`}>{mail}</Link>
          </Typography>
        )
      })}
      <Typography variant="subtitle1">
        {/* TODO - change i18n */}
        <Link href="https://github.com/Arquisoft/wiq_es05b" target="_blank" rel="noopener noreferrer">Checkout our
          github page!</Link>
      </Typography>
    </Paper>
  )
}

export default function About() {
  const mails = [
    "uo289295@uniovi.es",
    "uo288787@uniovi.es"
  ]

  return (
    <Container maxWidth="md" sx={{marginTop: '2rem', display: "flex", gap: "2rem", flexFlow: "column"}}>
      <FirstCard />
      <ContactCard mails={mails} />
    </Container>

  );
}
