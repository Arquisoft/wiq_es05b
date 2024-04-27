import CloseIcon from '@mui/icons-material/Close';
import { Box, Container, Divider, Tooltip, Typography } from "@mui/material";
import textFormat from "../../scripts/textFormat";

const Summary = ({ category, points }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h5" component="p">{textFormat(category)}</Typography>
      <Typography variant="h5" component="p">Points: {points}</Typography>
    </Box>
  )
}

const Question = ({ index, question }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="body1" component="p">{index}. {question.statement}</Typography>
      <Container>
        {question.options.map((option, i) => {
          if (i === question.correct) return <Typography key={i} variant="body2" color="success.main">{option}</Typography>
          if (i === question.answer && question.answer !== question.correct) return <Typography key={i} variant="body2" color="error.main">{option}</Typography>
          return <Typography key={i} variant="body2" color="">{option}</Typography>
        })}
      </Container>
      <Box sx={{ position: "absolute", right: 0, top: 0 }}>
        <Typography variant="body2" >Points: {question.points}</Typography>
        <Typography variant="body2" >Time: {question.time} s</Typography>
      </Box>
    </Box>
  )
}

const SaveDetails = ({ save, back }) => {
  return (
    <Box sx={{ display: "flex", flexFlow: "column", gap: "1rem"}}>

      <Tooltip title="Go back">
        <CloseIcon sx={{ cursor: 'pointer', paddingTop: '.5em', marginLeft: "auto" }} onClick={back} />
      </Tooltip>
      <Summary category={save.category} points={save.questions.reduce((acc, curr) => curr.points + acc, 0)} />
      <Divider />
      <Box sx={{ display: "flex", flexFlow: "column", gap: "1rem", maxHeight: '600px', overflowY: 'scroll' }}>
        {save.questions.map((q, i) =>
          <Question key={i} index={i + 1} question={q} />)}
      </Box>
    </Box>
  )
}

export default SaveDetails;