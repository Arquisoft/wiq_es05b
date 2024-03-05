import {Button, Container, Divider, Paper, Typography} from "@mui/material";

const buttonConfig = {
    width: "7rem"
}

const buttonGroup = {display: "flex", justifyContent: "space-evenly", margin: "1rem 0"}

const MyButton = ({text}) => {
    return (
        <Button variant="contained" sx={buttonConfig}>{text}</Button>
    )
}

export default function GameMenu() {

    return (
        <Container component="main" maxWidth="md" sx={{ marginTop: 4, display: "flex", flexDirection: {xs:"row", md:"column"} }}>
            <Paper elevation={3} sx={{margin: "2rem 0", padding: "1rem", textAlign: "center"}}>
                <Typography variant="h3" component="p" sx={{marginBottom: "2rem"}}>
                    Menu
                </Typography>
                <Container>
                    <Typography variant="h5" component="p">
                        Options
                    </Typography>
                    <Container sx={buttonGroup}>
                        <MyButton text="Time" />
                        <MyButton text="Custom" />
                    </Container>
                </Container>
                <Container>
                    <Typography variant="h5" component="p">Choose a category to play</Typography>
                    <Container sx={buttonGroup}>
                        <MyButton text="Countries" />
                        <MyButton text="Other Category" />
                        <MyButton text="Other Category" />
                        <MyButton text="Other Category" />
                    </Container>
                </Container>
            </Paper>
        </Container>
    )
}