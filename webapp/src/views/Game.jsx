import { AuthContext } from "./context/AuthContext";
import { Snackbar, IconButton, Box, Button, Container, LinearProgress, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imgFondoBtn from '../media/border.png';
import coinImage from "../media/coin.svg";
import grave from "../media/graveJordi.svg";
import { AuthContext } from "../views/context/AuthContext";
import Loader from "./components/Loader";
import CloseIcon from '@mui/icons-material/Close';
import ProtectedComponent from "./components/ProtectedComponent";
import ServiceDownMessage from "./components/ServiceDownMessage";

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

const ErrorSnackBar = ({msg}) => {
  const [open, setOpen] = useState(true)

  return (
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={msg}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      />
  )
}

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

const GameView = ({pointsUpdated, current, timeLeft, progressBarPercent, answer, n}) => {
  if (n === 0)
    return (
      <Paper elevation={3} sx={{padding: "1rem 0" }}>
        <Loader />
      </Paper>
    )
  return (
    <>
      <Coin pointsUpdated={pointsUpdated} />
      <Question current={current} />
      <Line timeLeft={timeLeft} progressBarPercent={progressBarPercent} />
      <Buttons answer={answer} questions={current} />
    </>
  )
}

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
    const [error, setError] = useState(null);
    const [historyE, setHistoryE] = useState()
    const [saveId, setSaveId] = useState()

    // Next question
    const next = useCallback(() => {
        if (current === questions.length - 1) {
            let endTime = performance.now();
            storePoints();
            navigate("/endgame", { state: { points:pointsUpdated,correct:correctA,wrong:wrongA,time:endTime-startTime} });
        }

        setCurrent(current + 1);
        setTimeLeft(initialTime);
        setProgressBarPercent(0);
    }, [current, questions.length, initialTime, navigate, pointsUpdated, correctA, wrongA]);

    const storePoints = async () => {
      const body = {
        name : getUser()["username"],
        points : pointsUpdated
      }
      await axios.post(`${apiEndpoint}/addScore`, body)
    }
    
  // Timer
  // FIXME - The time must start when the first questions is loaded,
  // if there is a delay in the server the time will be wrong
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
  const fetchQuestions = (url) => {
    axios
      .get(url)
      .then((response) => {
        setQuestions(response.data)
        return response.data
      })
      .then(() => {
        axios
          .post(`${apiEndpoint}/history/create`, {userId: getUser().userId, category: category, token: getUser().token})
          .then(response => setSaveId(response.data.id))
          .catch(() => setHistoryE("An error occured while saving the game history"))
      })
      .catch((e) => {setError({code: e.response.status, error: e.response.data.error})});
  };

  // Function to answer a question
  const answer = (i) => {
    //Server-side validation
    const params = {
      token: getUser()["token"],
      id: questions[current]._id,
      answer: questions[current].options[i],
    };

    //Fetch correct answer
    axios
      .post(`${apiEndpoint}/game/answer`, params)
      .then(response => {
        // Mark in red the incorrect answers and in green the correct one
        const correct = questions[current].options.filter(
          (o) => o === response.data.answer
        );
        const correctIndex = questions[current].options.indexOf(correct[0]);

        if (i !== correct) changeButtonColor(i, "red");

        changeButtonColor(correctIndex, "green");
        const newPoints = pointsUpdated + (i === correctIndex ? correctPoints : wrongPoints);
        
        if  (newPoints > 0)
            setPointsUpdated(newPoints);
        else
            setPointsUpdated(0);

        (i === correctIndex ? setCorrectA(correctA+1) : setWrongA(wrongA+1) );
        setTimeout(() => {
          next();
        }, 200);
        return response.data.answer
      })
      .then(async correct => {
        if(historyE) return
        const q = {
          last: questions.length === current + 1,
          statement: questions[current].statement,
          options: questions[current].options,
          answer: i,
          correct: questions[current].options.indexOf(correct),
          points: i === questions[current].options.indexOf(correct) ? correctPoints : wrongPoints,
          time: initialTime - timeLeft,
          token: getUser().token
        }
        await axios.post(`${apiEndpoint}/history/add/${saveId}`, q)
      })
      .catch((e) => {setError({code: e.response.status, error: e.response.data.error})});
  };

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
        {error ? 
          <Paper elevation={3} sx={{padding: "1rem 0" }}>
            <ServiceDownMessage grave={grave} code={error.code} reason={error.error} />
          </Paper>
          : 
          <GameView
            pointsUpdated={pointsUpdated}
            current={questions[current]}
            timeLeft={timeLeft}
            progressBarPercent={progressBarPercent}
            answer={answer}
            n={questions.length}
          />
        }
        {historyE && <ErrorSnackBar msg={historyE} />}
      </Container>
    </>
  );
}
