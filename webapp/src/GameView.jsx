import {Button, Container, Divider, Paper, Typography} from "@mui/material";

export default function GameView() {

    const buttonStyle = {
        height: "10rem",
        width: {xs: "auto", md: "10rem"},
        fontSize: "4rem"
    }

    return (
        <Container component="main" maxWidth="md" sx={{ marginTop: 4, display: "flex", flexDirection: {xs:"row", md:"column"} }}>
            <Paper elevation={3} sx={{margin: "2rem 0", padding: "1rem"}}>
                <Typography variant="h4">
                    Question
                </Typography>
                <Divider sx={{margin: "10px 0"}} />
                <Typography component="p" variant="h6">
                    a)
                </Typography>
                <Typography component="p" variant="h6">
                    b)
                </Typography>
                <Typography component="p" variant="h6">
                    c)
                </Typography>
                <Typography component="p" variant="h6">
                    d)
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