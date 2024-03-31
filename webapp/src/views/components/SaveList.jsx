import {Container, List, ListItem, ListItemText, Pagination} from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import SaveDetails from "./SaveDetails";
import textFormat from "../../scripts/textFormat";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000"
const limit= 10

const Save = ({save, onClick}) => {
  const date = new Date(save.createdAt)
  const formattedDate = date.toISOString().split("T")[0];

  const points = save.questions.reduce((acc, current) => acc + current.points, 0)
  return (
    <ListItem
      button
      onClick={() => onClick(save)}
      secondaryAction={<ListItemText primary={points} secondary="Points" />}
    >
      <ListItemText primary={textFormat(save.category)} secondary={formattedDate}/>
    </ListItem>
  )
}

const SaveList = () => {
  const { getUser } = useContext(AuthContext)
  const [saves, setSaves] = useState([])
  const [displayedSave, setDisplayedSave] = useState()
  const [page, setPage] = useState(0)
  const [maxPages, setMaxPages] = useState(0)

  const fetchSaves = () => {
    axios({
      method: 'get',
      url: `${apiEndpoint}/history/get/${getUser().userId}?page=${page}&limit=${limit}`,
      headers: {
        'Authorization': `Bearer ${getUser().token}`
      }
    })
      .then(response => {
        setSaves(response.data.saves)
        setMaxPages(response.data.maxPages)
      })
      // TODO - If down show ServerDownMessage
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(fetchSaves, [page, getUser]);

  return (
    <Container sx={{display:"flex", flexFlow: "column", alignItems: "stretch"}}>
      {
        displayedSave ?
          <SaveDetails save={displayedSave} back={() => setDisplayedSave(null)}/> :
          (<>
            <List>
            {
              saves.map((save, index) =>
                <Save key={index} save={save} onClick={setDisplayedSave}/>
              )
            }
            </List>
            <Pagination
              count={maxPages}
              color="primary"
              showFirstButton
              showLastButton
              sx={{alignSelf: "center"}}
              onChange={(_, p) => setPage(p - 1)}
            />
          </>)
      }
    </Container>
  )
}

export default SaveList;