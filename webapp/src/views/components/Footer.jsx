import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";

export default function Footer() {
  return (
    <Container sx={{height: "7rem"}}>
      <AppBar data-testid="footer" color="primary" sx={{ top: "auto", bottom: 0, position: "fixed" }} component="footer">
        <Toolbar role="toolbar" sx={{ justifyContent: "center" }}>
          <Typography>&copy; {new Date().getFullYear()} ASW - WIQ05b</Typography>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
