import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function GameView() {

    //State storing all questions
    const [questions, setQuestions] = useState([]);

    // State to track the index of the current question
    const [current, setCurrent] = useState(0);

    // State to see correct answers
    const [correctAnswers, setCorrectAnswers] = useState(0);

    //Fetch questions just at the beginning
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        const response = await fetch('http://localhost:8000/questions/mock');
        const data = await response.json();
        setQuestions(data);
    }

    const answer = (i) => {
        if (questions[current].answer === i) {
            setCorrectAnswers(correctAnswers + 1);
            setCurrent(current + 1);
        }
    }


    const buttonStyle = {
        height: "10rem",
        width: { xs: "auto", md: "10rem" },
        fontSize: "4rem"
    }

    if (questions.length === 0)
        return null;

    return (
        <Container component="main" maxWidth="md" sx={{ marginTop: 4, display: "flex", flexDirection: { xs: "row", md: "column" } }}>
            <p>Correct answers: {correctAnswers}</p>
            <Paper elevation={3} sx={{ margin: "2rem 0", padding: "1rem" }}>
                <Typography variant="h4">
                    {questions[current].question}
                </Typography>

                <Divider sx={{ margin: "10px 0" }} />

                {questions[current].options.map((option, i) => (

                    <Typography key={i} component="p" variant="h6">
                        {i}) {option}
                    </Typography>
                ))}

            </Paper>
            <Container sx={{ display: "flex", justifyContent: "space-around", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch" } }} >
                <Button color="darkGreen" variant="contained" sx={buttonStyle} onClick={() => answer(0)}>0</Button>
                <Button color="lightGreen" variant="contained" sx={buttonStyle} onClick={() => answer(1)}>1</Button>
                <Button color="darkGreen" variant="contained" sx={buttonStyle} onClick={() => answer(2)}>2</Button>
                <Button color="lightGreen" variant="contained" sx={buttonStyle} onClick={() => answer(3)}>3</Button>
            </Container>

        </Container>
    )
}