import {Container, List, ListItem, ListItemText, Pagination} from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000"
const limit= 10

const Save = ({save}) => {
  const date = new Date(save.createdAt)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const points = save.questions.reduce((acc, current) => acc + current.points, 0)
  return (
    <ListItem button secondaryAction={<ListItemText primary={points} secondary="Points" />}>
      <ListItemText primary={save.category} secondary={formattedDate}/>
    </ListItem>
  )
}

const SaveList = () => {
  const { getUser } = useContext(AuthContext)
  const [saves, setSaves] = useState([])
  const [page, setPage] = useState(0)
  const [maxPages, setMaxPages] = useState(0)

  const fetchSaves = () => {
    axios({
      method: 'get',
      // FIXME - Use the user id instead of the token (make an endpoint to retrieve user data)
      url: `${apiEndpoint}/history/get/${getUser().token}?page=${page}&limit=${limit}`,
      headers: {
        'Authorization': `Bearer ${getUser().token}`
      }
    })
      .then(response => {
        setSaves(response.data.saves)
        setMaxPages(response.data.maxPages)
      })
      // TODO - Show server down view
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(fetchSaves, [page]);

  return (
    <Container sx={{display:"flex", flexFlow: "column", alignItems: "stretch"}}>
      <List>
        {
          saves.map((save, index) => <Save key={index} save={save}/>)
        }
      </List>
      <Pagination count={maxPages} color="primary" showFirstButton showLastButton sx={{alignSelf: "center"}} onChange={(_, p) => setPage(p - 1)}/>
    </Container>
  )
}

export default SaveList;