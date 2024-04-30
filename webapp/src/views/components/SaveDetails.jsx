import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { Fragment, useContext } from "react";
import textFormat from "../../scripts/textFormat";
import { LocaleContext } from "../context/LocaleContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const insertBreakAfterN = (text, n=30) => {
  if (text.length <= n) return text;
  let index = text.indexOf(' ', n);
  if (index === -1) return text;
  let parts = [text.slice(0, index), text.slice(index + 1)];
  return parts.map((part, i) => <Fragment key={i}>{part}<br /></Fragment>);
}

const Summary = ({ category, points }) => {
  const { t } = useContext(LocaleContext)
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h5" component="p">{textFormat(category)}</Typography>
      <Typography variant="h5" component="p">{t("history_points")} {points}</Typography>
    </Box>
  )
}

const Question = ({ index, question }) => {
  const { t } = useContext(LocaleContext)
  return (
    <Box sx={{position: "relative"}}>
      <Typography variant="h6" component="p" style={{color: question.isHot ? "red" : ""}}>{index}. {insertBreakAfterN(question.statement)}</Typography>
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

const SaveDetails = ({ save, back }) => {
  const { t } = useContext(LocaleContext)
  return (
    <Container sx={{ display: "flex", flexFlow: "column", gap: "1rem"}}>
      <Button color="primary" onClick={back} startIcon={<ArrowBackIcon />} sx={{alignSelf: "start"}}>
        {t("button_back")}
      </Button>
      <Summary category={save.category} points={save.questions.reduce((acc, curr) => curr.points + acc, 0)} />
      <Divider />
      <Box sx={{ display: "flex", flexFlow: "column", gap: "1rem", maxHeight: '400px', overflowY: 'scroll' }}>
        {save.questions.map((q, i) =>
          <Question key={i} index={i + 1} question={q} />)}
      </Box>
    </Container>
  )
}

export default SaveDetails;