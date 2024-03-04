import {Button, Container, Typography} from "@mui/material";

export default function GameMenu() {

    return (
        <Container>
            <Typography>
                Menu
            </Typography>
            <Container>
                <Typography>
                    Options
                </Typography>
                <Container>
                    <Button>Time</Button>
                    <Button>Custom</Button>
                </Container>
            </Container>
            <Container>
                <Typography>Choose a category to play</Typography>
                <Container>
                    <Button>Countries</Button>
                    <Button>Other category</Button>
                    <Button>Other category</Button>
                    <Button>Other category</Button>
                </Container>
            </Container>
            <Button>Play</Button>
        </Container>
    )
}