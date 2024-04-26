import {Box, Typography, Container, Button, Divider} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import textFormat from "../../scripts/textFormat";
import {useContext} from "react";
import {LocaleContext} from "../context/LocaleContext";

const Summary = ({category, points}) => {
  const { t } = useContext(LocaleContext)
  return (
    <Box sx={{display: "flex", justifyContent: "space-between"}}>
      <Typography variant="h5" component="p">{textFormat(category)}</Typography>
      <Typography variant="h5" component="p">{t("history_points")} {points}</Typography>
    </Box>
  )
}

const Question = ({index, question}) => {
  const { t } = useContext(LocaleContext)
  return (
    <Box sx={{position: "relative"}}>
      <Typography variant="h6" component="p" color = {question.isHot ? "red" : ""}>{index}. {question.statement}</Typography>
        <Container>
          {question.options.map((option, i) => {
            if (i === question.correct) return <Typography key={i} color="success.main">{option}</Typography>
            if(i === question.answer && question.answer !== question.correct) return <Typography key={i} color="error.main">{option}</Typography>
            return <Typography key={i} color="">{option}</Typography>
          })}
        </Container>
        <Box sx={{position: "absolute", right: 0, top: 0}}>
          <Typography>{t("history_points")} {question.points}</Typography>
          <Typography>{t("history_time")} {question.time} s</Typography>
        </Box>
    </Box>
  )
}

const SaveDetails = ({save, back}) => {
  return (
    <Box sx={{display: "flex", flexFlow: "column", gap: "1rem"}}>
      <Button color="primary" onClick={back} startIcon={<ArrowBackIcon />} sx={{alignSelf: "start"}}>
       Go back
      </Button>
      <Summary category={save.category} points={save.questions.reduce((acc, curr) => curr.points + acc, 0)}/>
      <Divider />
      <Box sx={{display: "flex", flexFlow: "column", gap: "1rem"}}>
        {save.questions.map((q, i) =>
          <Question key={i} index={i + 1} question={q}/>)}
      </Box>
    </Box>
  )
}

export default SaveDetails;