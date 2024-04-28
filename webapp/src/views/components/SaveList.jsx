import { Box, List, ListItem, ListItemText, Pagination } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import textFormat from "../../scripts/textFormat";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import SaveDetails from "./SaveDetails";

const limit = 10

const Save = ({ save, onClick }) => {
  const { t } = useContext(LocaleContext)
  const date = new Date(save.createdAt)
  const formattedDate = date.toISOString().split("T")[0];

  const points = save.questions.reduce((acc, current) => acc + current.points, 0)
  return (
    <ListItem
      button
      onClick={() => onClick(save)}
      secondaryAction={<ListItemText primary={points} secondary={t("history_points2")} />}
    >
      <ListItemText primary={textFormat(save.category)} secondary={formattedDate} />
    </ListItem>
  )
}

const SaveList = (props) => {
  const { getUser } = useContext(AuthContext)
  let { user } = props
  const [saves, setSaves] = useState([])
  const [displayedSave, setDisplayedSave] = useState()
  const [page, setPage] = useState(0)
  const [maxPages, setMaxPages] = useState(0)

  //If there is no user in passed, use logged user
  if (!user)
    user = getUser();
  else
    user.userId = user._id;

  const fetchSaves = () => {
    axios
      .get(`/history/get/${user.userId}?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${getUser().token}` } })
      .then(response => {
        setSaves(response.data.saves)
        setMaxPages(response.data.maxPages)
      })
      // TODO - If down show ServerDownMessage
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(fetchSaves, [page]);

  return (
    <Box sx={{ display: "flex", flexFlow: "column", alignItems: "stretch"}}>
      {
        displayedSave ?
          <SaveDetails save={displayedSave} back={() => setDisplayedSave(null)} /> :
          (<>
            <List>
              {
                saves.map((save, index) =>
                  <Save key={index} save={save} onClick={setDisplayedSave} />
                )
              }
            </List>
            <Pagination
              count={maxPages}
              color="primary"
              showFirstButton
              showLastButton
              sx={{ alignSelf: "center" }}
              onChange={(_, p) => setPage(p - 1)}
            />
          </>)
      }
    </Box>
  )
}

export default SaveList;