import { Box, Container } from '@mui/material';
import React, { useContext } from 'react';
import Logo from "../media/logoL.svg";
import Card from "./components/Card";
import { LocaleContext } from "./context/LocaleContext";

export default function About() {
  const { t } = useContext(LocaleContext)

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', display: "flex", gap: "2rem", flexFlow: "column", alignItems: "center" }}>

      <Card width={'94%'} height={'fitContent'} title={t("about_title")} image={Logo} imageHeigth={'45%'} lines={[
        t("about_p1"),
        t("about_p2"),
        t("about_p3"),
        t("about_p4")
      ]} />
      <Box sx={{ display: 'flex', gap: '2rem', flexFlow: 'row wrap', justifyContent: 'center', width: '100%' }}>
        <Card link={"https://github.com/Arquisoft/wiq_es05b"} width={'45%'} height={'300px'} title={t("about_app")} image={'about-git.jpg'} imageHeigth={'50%'} lines={[t("about_github")]} />
        <Card link={"/howTo"} width={'45%'} height={'300px'} title={t("about_guide")} image={'about-guide.png'} imageHeigth={'50%'} lines={[t("about_guide_line")]} />
      </Box>
      <Card link={"https://www.rtve.es/play/videos/saber-y-ganar/"} width={'94%'} height={'500px'} title={t("about_program")} image={'about-jordi.jpg'} imageHeigth={'65%'} lines={[t("about_program_line"), t("about_program_line2")]} />

    </Container>
  );
}
