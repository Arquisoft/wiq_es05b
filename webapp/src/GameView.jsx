import {Button, Container, Typography} from "@mui/material";

export default function GameView() {

    return (
        <Container>
            <Typography>
                Question
            </Typography>
            <Container>
                <Button>A</Button>
                <Button>B</Button>
                <Button>C</Button>
                <Button>D</Button>
            </Container>
        </Container>
    )
}