import ProtectedComponent from "./components/ProtectedComponent";
import {Box, Button, Container, LinearProgress, Paper, Typography} from "@mui/material";
import coinImage from "../media/coin.svg";
import imgFondoBtn from "../media/border.png";
import axios from "axios";
import {useContext, useEffect, useRef, useState} from "react";
import Loader from "./components/Loader";
import {AuthContext} from "./context/AuthContext";
import ServiceDownMessage from "./components/ServiceDownMessage";
import grave from "../media/graveJordi.svg"
import {useLocation, useParams} from "react-router-dom";
import ErrorSnackBar from "./components/ErrorSnackBar";
import Endgame from "./Endgame";
import { LocaleContext } from "./context/LocaleContext";
import GameContext from './context/GameContext';

const initialTime = 10

const fetchQuestions = async (category, token, n = 10) => {
  const response =  await axios.get(`/game/questions/${category}/${n}`, {headers: {Authorization: `Bearer ${token}`}})
  return response.data;
}

const changeButtonColor = (i, color) => {
  const button = document.getElementById(`button${i}`);
  if (button != null) {
    button.style.color = color;
    setTimeout(() => {
      button.style.color = "";
    }, 500);
  }
};

const Points = ({points}) => {
  return (
    <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
      <Typography sx={{ fontWeight: 400, fontSize: "35px" }}>
        {points}
      </Typography>
      <img src={coinImage} alt="Coin" style={{ marginLeft: "10px" }} />
    </Box>
  );
}

const Title = ({question,special}) => {
  const color = special ? "red" : "black";
  return (
    <Paper elevation={3} sx={{ padding: "1rem" }}>
      <Typography variant="h4" style={{color}}>{question.statement}</Typography>
    </Paper>
  );
}

const Line = ({progressBarPercent}) => {
  return  (
    <LinearProgress
      color={progressBarPercent > 70 ? "red" : "light"}
      variant="determinate"
      value={progressBarPercent}
    />
  )
}

const Timer = ({time, setTime, interval}) => {
  const { t } = useContext(LocaleContext)

  useEffect(() => {
    const tick = () => setTime((prevTime) => prevTime - 1);

    if (time > 0) interval.current = setInterval(tick, 1000);
    else clearInterval(interval.current);

    return () => clearInterval(interval.current);
  }, [time, setTime, interval]);

  return (
    <Paper elevation={3} sx={{ padding: "1rem"}}>
      <Box sx={{ ml: 1, display: "flex", margin: "5px" }}>
        <Typography sx={{ fontWeight: 400, fontSize: "15px" }}>
          {t("game_time_left")} {time}
        </Typography>
      </Box>
      <Box sx={{ margin: "10px" }}>
        <Line progressBarPercent={10 * (10 - time)} />
      </Box>
    </Paper>
  );
}

const Buttons = ({question, setAnswer, disabled}) => {
  const buttonStyle = {
    height: {xs: "10rem", md: "13rem"},
    width: "100%",
    fontSize: "1.5rem",
    background: `url(${imgFondoBtn})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    margin: '5px',
    color:'black',
    padding: "3rem"
  }

  return (
    <Paper elevation={3} sx={{padding: "1rem 0" }}>
      <Container sx={{ display: "grid", gridTemplateColumns: {xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)"} }}>
        {question.options.map((option, i) => (
          <Button disabled={disabled} key={i} id={`button${i}`} sx={buttonStyle} onClick={() => setAnswer(option)}>
            {option}
          </Button>
        ))}
      </Container>
    </Paper>
  );
}

const Counter = ({current, total}) => {
  return (
    <Typography sx={{ fontWeight: 400, fontSize: "35px" }}>{current + 1}/{total}</Typography>
  )
}

const MainView = ({error, historialError, setHistorialError, questions,
                  current, setAnswer, interval, time,
                  setTime, points, correct, wrong,
                  totalTime, disabledButton}) => {
  if (error)
    return (
      <Paper elevation={3} sx={{padding: "1rem 0"}}>
        <ServiceDownMessage code={error.status} reason={error.error} grave={grave} />
      </Paper>
    )
  if (questions.length === 0)
    return (
      <Paper elevation={3} sx={{padding: "1rem 0"}}><Loader /></Paper>
    )
  if(questions.length === current)
    return (
      <Endgame points={points} correct={correct} wrong={wrong} time={totalTime} />
    )
  return (
    <>
      <Box sx={{ display: "flex", flexFlow: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Points points={points} />
        <Counter current={current} total={questions.length}/>
      </Box>
      <Title question={questions[current]} special={special} />
      <Timer time={time} setTime={setTime} interval={interval} />
      <Buttons question={questions[current]} setAnswer={setAnswer} disabled={disabledButton} />
      {historialError && <ErrorSnackBar msg={historialError} setMsg={setHistorialError} />}
    </>
  )
}

const Game = () => {
  const { getUser } = useContext(AuthContext)
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [current, setCurrent] = useState(0);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(initialTime);
  const [error, setError] = useState();
  const [historialError, setHistorialError] = useState();
  const saveId = useRef()
  const interval = useRef()
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [disabledButton, setDisabledButton] = useState(false)
  const { category} = useParams()
  const [count,setCount] = useState(0);
  const [specialQuestionNumber,setSpecialQuestionNumber] = useState(Math.floor(Math.random() * 10));
  const[special,setSpecial] = useState(false);
  const { hotQuestion, setHotQuestion } = useContext(GameContext);
  const handleNextQuestion = async () => {
    clearInterval(interval.current)
    setDisabledButton(true)
    interval.current = setInterval(() => {
      setTime((prevTimer) => prevTimer - 1);
    }, 1000);

    if(!saveId.current) await createSave()
    if(!saveId.current) return
    axios
      .post(`/game/answer?isHot=${special && hotQuestion}`, {
        token: getUser().token,
        saveId: saveId.current,
        questionId: questions[current]._id,
        last: current === questions.length - 1,
        answer,
        time: initialTime - time,
        statement: questions[current].statement,
        options: questions[current].options
      })
      .then(response => {
        const { error } = response.data
        setHistorialError(error)
        setCount(count+1);
        setSpecial(count === specialQuestionNumber)
        setPoints(points + response.data.points)
        const correctAnswer = response.data.answer

        const iAnswered = questions[current].options.indexOf(answer)
        const iCorrect = questions[current].options.indexOf(correctAnswer)

        if(iAnswered !== iCorrect) {
          changeButtonColor(iAnswered, "red")
          if(iAnswered !== -1) setWrong(wrong + 1)
        } else {
          setCorrect(correct + 1)
        }
        setTotalTime((initialTime - time) + totalTime)
        changeButtonColor(iCorrect, "green")

        setTimeout(() => {
          setTime(initialTime)
          setDisabledButton(false)
          setCurrent(current + 1);
          setAnswer(null)
        }, 500)
      })
      .catch(e => setHistorialError(e.response.data.error))
  }

  const createSave = async () => {
    try {
      const response = await axios
        .post("/history/create", {
          token: getUser().token,
          category: category,
          userId: getUser().userId
        })
      saveId.current = response.data.id
    } catch (err) {
      setHistorialError(err.response.data.error)
    }
  }

  useEffect( () => {
    fetchQuestions(category, getUser().token)
      .then(data => setQuestions(data))
      .catch(err => setError({error: err.response.data.error, status: err.response.status}));
    createSave()
    return () => clearInterval(interval.current)
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(time === 0 || answer !== null) handleNextQuestion();
    //eslint-disable-next-line
  }, [time, answer]);

  return (
    <ProtectedComponent>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <MainView
          error={error}
          historialError={historialError}
          setHistorialError={setHistorialError}
          questions={questions}
          setAnswer={setAnswer}
          interval={interval}
          time={time}
          setTime={setTime}
          points={points}
          current={current}
          correct={correct}
          wrong={wrong}
          totalTime={totalTime}
          special={(special && hotQuestion)}
          disabledButton={disabledButton}
        />
      </Container>
    </ProtectedComponent>
  )
}

export default Game;
