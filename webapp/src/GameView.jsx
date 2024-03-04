import {Button, Container, Paper, Typography} from "@mui/material";

export default function GameView() {

    const buttonStyle = {
        height: "10rem",
        width: {xs: "auto", md: "10rem"},
        fontSize: "4rem"
    }

    return (
        <Container component="main" maxWidth="md" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{margin: "2rem 0", padding: "1rem"}}>
                <Typography variant="h4">
                    Question
                </Typography>
            </Paper>
            <Container sx={{display: "flex", justifyContent: "space-around", flexDirection: {xs: "column", md: "row"}, alignItems: {xs: "stretch"}}} >
                <Button color="darkGreen" variant="contained" sx={buttonStyle}>A</Button>
                <Button color="lightGreen" variant="contained" sx={buttonStyle}>B</Button>
                <Button color="darkGreen" variant="contained" sx={buttonStyle}>C</Button>
                <Button color="lightGreen" variant="contained" sx={buttonStyle}>D</Button>
            </Container>
        </Container>
    )
}