import {Fragment} from "react";
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";

function Footer() {
    return (
        <Fragment>
            <CssBaseline />
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar sx={{justifyContent: "center"}}>
                    <Typography>
                        &copy; {new Date().getFullYear()} ASW - WIQ05b
                    </Typography>
                </Toolbar>
            </AppBar>
        </Fragment>
    );
}

export default Footer