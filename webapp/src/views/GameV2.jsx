import ProtectedComponent from "./components/ProtectedComponent";
import {Box, Button, Container, LinearProgress, Paper, Typography} from "@mui/material";
import coinImage from "../media/coin.svg";
import imgFondoBtn from "../media/border.png";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import Loader from "./components/Loader";
import {AuthContext} from "./context/AuthContext";
import ServiceDownMessage from "./components/ServiceDownMessage";
import grave from "../media/graveJordi.svg"

const initialTime = 10

const fetchQuestions = async (category, n = 10) => {
  const response =  await axios.get(`/questions/${category}/${n}`)
  return response.data;
}

const fetchAnswer = async (id, token) => {
  const response = await axios.post("/game/answer", {id, token});
  return response.data;
}

const changeButtonColor = (i, color) => {
  const button = document.getElementById(`button${i}`);
  if (button != null) {
    button.style.color = color;
    setTimeout(() => {
      button.style.color = "black";
    }, 500);
  }
};

const handleNextQuestion = (current, setCurrent, setTime) => {
  // Si se contesta -> Enviar respuesta marcada
  // Si no se acaba el tiempo -> Enviar null

  // Recuperar puntos de la pregunta
  // Recuperar respuesta correcta
  // Reiniciar botones y contador
  setTime(initialTime)
  // Cargar siguiente pregunta
  setCurrent(current + 1);
}

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

const Title = ({question}) => {
  return (
    <Paper elevation={3} sx={{ padding: "1rem" }}>
      <Typography variant="h4">{question.statement}</Typography>
    </Paper>
  );
}

const Line = ({progressBarPercent}) => {
  return progressBarPercent > 70 ? (
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
}

const Timer = ({time, setTime}) => {
  const [interval, setInterval] = useState();

  useEffect(() => {
    if(time === 0) {
      clearInterval(interval)
      return;
    }
    const aux = window.setInterval(() => setTime(time - 1), 1000)
    setInterval(aux)
    return () => {
      setInterval(null)
      clearInterval(interval)
    }
  }, [time]);

  return (
    <Paper elevation={3} sx={{ padding: "1rem"}}>
      <Box sx={{ ml: 1, display: "flex", margin: "5px" }}>
        <Typography sx={{ fontWeight: 400, fontSize: "15px" }}>
          Time left: {time}
        </Typography>
      </Box>
      <Box sx={{ margin: "10px" }}>
        <Line progressBarPercent={10 * (10 - time)} />
      </Box>
    </Paper>
  );
}

const Buttons = ({question}) => {
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
          <Button key={i} id={`button${i}`} sx={buttonStyle} onClick={() => {}}>
            {option}
          </Button>
        ))}
      </Container>
    </Paper>
  );
}

const Game = () => {
  const { getUser } = useContext(AuthContext)
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState(-1);
  const [current, setCurrent] = useState(0);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(initialTime);
  // const [answered, setAnswered] = useState(false);
  const [error, setError] = useState();
  const [historialError, setHistorialError] = useState();


  useEffect( () => {
    fetchQuestions("capitals")
      .then(data => setQuestions(data))
      .catch(err => setError({error: err.response.data.error, status: err.response.status}));
    //eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   if(!answered) return;
  //   fetchAnswer(questions[current]._id, getUser().token)
  //     .then(response => {
  //       console.log(response.answer === questions[current].options[answer])
  //     })
  //     .catch(err => console.log(err));
  // }, [answered]);

  useEffect(() => {
    if(time === 0) handleNextQuestion(current, setCurrent, setTime);
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
        {/* TODO - Move to component */}
        {/* TODO - When last = questions.length show Endgame and remove from router */}
        {
          error ?
            <Paper elevation={3} sx={{padding: "1rem 0" }}>
              <ServiceDownMessage code={error.status} reason={error.error} grave={grave} />
            </Paper> :
            questions.length === 0 ? <Paper elevation={3} sx={{padding: "1rem 0" }}><Loader /></Paper> :
              <>
                <Points points={points} />
                <Title question={questions[current]} />
                <Timer time={time} setTime={setTime} />
                <Buttons question={questions[current]} />
              </>
        }
      </Container>
    </ProtectedComponent>
  )
}

export default Game;