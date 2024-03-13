import { Button, Container, Divider, Paper, Typography, LinearProgress, linearProgressClasses, Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function Game() {

    const { category } = useParams();

    //State storing all questions
    const [questions, setQuestions] = useState([]);

    // State to track the index of the current question
    const [current, setCurrent] = useState(0);

    // State to see correct answers
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // Linear time bar
    const initialTime = 10; // seconds

    const [timeLeft, setTimeLeft] = useState(initialTime);

    const [progressBarPercent, setProgressBarPercent] = useState(0);

    const timerId = useRef();

    useEffect(() => {
        if (initialTime) {
            timerId.current = window.setInterval(() => {
                setTimeLeft((prevProgress) => prevProgress - 1);
            }, 1000);

            return () => {
                clearInterval(timerId.current);
            };
        }
    }, []);

    useEffect(() => {
        if (initialTime) {
            if (progressBarPercent < 100) {
                let updateProgressPercent = Math.round(
                    ((initialTime - (timeLeft - 1)) / initialTime) * 100
                );
                setProgressBarPercent(updateProgressPercent);
            }

            if (timeLeft === 0 && timerId.current) {
                setCurrent(current + 1);
                setTimeLeft(initialTime);
                setProgressBarPercent(0);
            }
        }
    }, [timeLeft]);


    //Fetch questions just at the beginning
    useEffect(() => {
        fetchQuestions(`${apiEndpoint}/questions/` + category);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchQuestions = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        setQuestions(data);
    }

    const answer = async (i) => {
        //Server-side validation
        const params = {
            id: questions[current]._id,
            answer: questions[current].options[i]
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        };

        const response = await fetch(`${apiEndpoint}/game/answer`, requestOptions);
        const result = await response.json();

        if (result === true) {
            setCorrectAnswers(correctAnswers + 1);
            changeButtonColor(i, true);
        } else
            changeButtonColor(i, false);

        setTimeout(() => {
            setCurrent(current + 1);
            setTimeLeft(initialTime);
        }, 200);
    }

    const changeButtonColor = (i, isCorrect) => {
        const button = document.getElementById(`button${i}`);

        const currentColor = button.style.backgroundColor;


        const color = isCorrect ? "green" : "red";
        button.style.backgroundColor = color;

        setTimeout(() => {
            button.style.backgroundColor = currentColor;
        }, 500);
    }

    const buttonStyle = {
        height: "10rem",
        width: { xs: "auto", md: "10rem" },
        fontSize: "4rem"
    }

    const MiLinea = () => {
        if (progressBarPercent > 80) {
            return (<LinearProgress color="red" variant={"determinate"} value={progressBarPercent} />)
        } else {
            return (<LinearProgress color="light" variant={"determinate"} value={progressBarPercent} />)
        }

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

            <Box sx={{ ml: 1, display: "flex", margin: "5px" }}>
                <Typography sx={{ fontWeight: 400, fontSize: "15px" }}>
                    Time left: {timeLeft}
                </Typography>
            </Box>
            <Box sx={{ margin: "10px" }}>
                <MiLinea />
            </Box>

            <Container sx={{ display: "flex", justifyContent: "space-around", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch" } }} >
                <Button id="button0" color="dark" variant="contained" sx={buttonStyle} onClick={() => answer(0)}>A</Button>
                <Button id="button1" color="light" variant="contained" sx={buttonStyle} onClick={() => answer(1)}>B</Button>
                <Button id="button2" color="dark" variant="contained" sx={buttonStyle} onClick={() => answer(2)}>C</Button>
                <Button id="button3" color="light" variant="contained" sx={buttonStyle} onClick={() => answer(3)}>D</Button>
            </Container>

        </Container>
    )
}
