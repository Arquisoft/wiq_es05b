import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function Game() {

    const {category} = useParams();

    //State storing all questions
    const [questions, setQuestions] = useState([]);

    // State to track the index of the current question
    const [current, setCurrent] = useState(0);

    // State to see correct answers
    const [correctAnswers, setCorrectAnswers] = useState(0);

    //Fetch questions just at the beginning
    useEffect(() => {
        fetchQuestions(`${apiEndpoint}/questions/` + category);
    }, []);

    const fetchQuestions = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        setQuestions(data);
    }

    const answer = (i) => {
        if (questions[current].answer === questions[current].options[i]) {
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
            <Paper elevation={3} sx={{ margin: "2rem 0", padding: "1rem" }}>
                <Typography variant="h4">
                    {questions[current].statement}
                </Typography>

                <Divider sx={{ margin: "10px 0" }} />

                {questions[current].options.map((option, i) => (

                <Typography key={i} component="p" variant="h6">
                    {String.fromCharCode(97 + i).toUpperCase()}. {option} 
                </Typography>

                ))}

            </Paper>
            <Container sx={{ display: "flex", justifyContent: "space-around", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch" } }} >
                <Button color="dark" variant="contained" sx={buttonStyle} onClick={() => answer(0)}>A</Button>
                <Button color="light" variant="contained" sx={buttonStyle} onClick={() => answer(1)}>B</Button>
                <Button color="dark" variant="contained" sx={buttonStyle} onClick={() => answer(2)}>C</Button>
                <Button color="light" variant="contained" sx={buttonStyle} onClick={() => answer(3)}>D</Button>
            </Container>

        </Container>
    )
}