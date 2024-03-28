import { Button, Container, Paper, Typography, LinearProgress, Box } from "@mui/material";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProtectedComponent from "./components/ProtectedComponent";
import axios from "axios";
import { AuthContext } from "../views/context/AuthContext";
import coinImage from "../media/coin.svg";
import imgFondoBtn from '../media/border.png';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const buttonStyle = {
  height: "13rem",
  width: "100%",
  fontSize: "1.5rem",
  background: `url(${imgFondoBtn})`,
  backgroundSize: '100% 100%',
  backgroundPosition: 'center',
  margin: '5px',
  color:'black'
}

// Linear time bar
const initialTime = 10; // seconds
const correctPoints = 100;
const wrongPoints = -20;
const startTime = performance.now();

// Change button color
const changeButtonColor = (i, color) => {
  const button = document.getElementById(`button${i}`);
  if (button != null) {
    button.style.color = color;
    setTimeout(() => {
      button.style.color = "black";
    }, 500);
  }
};

const MiLinea = ({ progressBarPercent }) =>
  progressBarPercent > 80 ? (
    <LinearProgress
      color="red"
      variant={"determinate"}
      value={progressBarPercent}
    />
  ) : (
    <LinearProgress
      color="light"
      variant={"determinate"}
      value={progressBarPercent}
    />
  );

const Coin = ({ pointsUpdated }) => {
  return (
    <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
      <Typography sx={{ fontWeight: 400, fontSize: "35px" }}>
        {pointsUpdated}
      </Typography>
      <img src={coinImage} alt="Coin" style={{ marginLeft: "10px" }} />
    </Box>
  );
};

const Question = ({ current }) => {
  return (
    <Paper elevation={3} sx={{ padding: "1rem" }}>
      <Typography variant="h4">{current.statement}</Typography>
    </Paper>
  );
};

const Line = ({ timeLeft, progressBarPercent }) => {
  return (
    <Paper elevation={3} sx={{ padding: "1rem"}}>
      <Box sx={{ ml: 1, display: "flex", margin: "5px" }}>
        <Typography sx={{ fontWeight: 400, fontSize: "15px" }}>
          Time left: {timeLeft}
        </Typography>
      </Box>
      <Box sx={{ margin: "10px" }}>
        <MiLinea progressBarPercent={progressBarPercent} />
      </Box>
    </Paper>
  );
};

const Buttons = ({ answer, questions }) => {
  return (
    <Paper elevation={3} sx={{padding: "1rem 0" }}>
      <Container sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        {questions.options.map((option, i) => (
            <Button key={i} id={`button${i}`} sx={buttonStyle} onClick={() => answer(i)}>
              {option}
            </Button>
        ))}
      </Container>
    </Paper>
  );
};

export default function Game() {
    const { category } = useParams();
    const { getUser } = useContext(AuthContext)
    const timerId = useRef();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [progressBarPercent, setProgressBarPercent] = useState(0);
    const [pointsUpdated, setPointsUpdated] = useState(0);
    const [correctA, setCorrectA] = useState(0);
    const [wrongA, setWrongA] = useState(0);

    // Next question
    const next = useCallback(() => {
        if (current === questions.length - 1) {
            let endTime = performance.now();
            navigate("/endgame", { state: { points:pointsUpdated,correct:correctA,wrong:wrongA,time:endTime-startTime} });
        }

        setCurrent(current + 1);
        setTimeLeft(initialTime);
        setProgressBarPercent(0);
    }, [current, questions.length, initialTime, navigate, pointsUpdated, correctA, wrongA]);
  // Timer
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

  // Update progress bar
  useEffect(() => {
    if (initialTime) {
      if (progressBarPercent < 100) {
        let updateProgressPercent = Math.round(
          ((initialTime - (timeLeft - 1)) / initialTime) * 100
        );
        setProgressBarPercent(updateProgressPercent);
      }

      if (timeLeft === 0 && timerId.current) {
        next();
      }
    }
  }, [timeLeft, progressBarPercent, current, next]);

  //Fetch questions just at the beginning
  useEffect(() => {
    fetchQuestions(`${apiEndpoint}/questions/${category}/10`);
    // eslint-disable-next-line
  }, []);

  // Function to fetch questions
  const fetchQuestions = async (url) => {
    const { data } = await axios.get(url);
    setQuestions(data);
  };

  // Function to answer a question
  const answer = async (i) => {
    //Server-side validation
    const params = {
      token: getUser()["token"],
      id: questions[current]._id,
      answer: questions[current].options[i],
    };

    //Fetch correct answer
    let response;
    try {
      response = await axios.post(`${apiEndpoint}/game/answer`, params);
    } catch (error) {
      console.log("Error fetching response");
    }

    // Mark in red the incorrect answers and in green the correct one
    const correct = questions[current].options.filter(
      (o) => o === response.data.answer
    );
    const correctIndex = questions[current].options.indexOf(correct[0]);

    if (i !== correct) changeButtonColor(i, "red");

    changeButtonColor(correctIndex, "green");
    const newPoints = pointsUpdated + (i === correctIndex ? correctPoints : wrongPoints);
    setPointsUpdated(newPoints);
    (i === correctIndex ? setCorrectA(correctA+1) : setWrongA(wrongA+1) );
    setTimeout(() => {
      next();
    }, 200);
  };

  // TODO - Show error template <ServiceDownMessage />
  if (questions.length === 0) return null;

  return (
    <>
      <ProtectedComponent />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          gap: "1rem"
        }}
      >
        <Coin pointsUpdated={pointsUpdated} />
        <Question current={questions[current]} />
        <Line timeLeft={timeLeft} progressBarPercent={progressBarPercent} />
        <Buttons answer={answer} questions={questions[current]} />
      </Container>
    </>
  );
}
