import ProtectedComponent from "./components/ProtectedComponent";
import {Button, Container, Paper, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./context/AuthContext";
import MyAvatar from "./components/MyAvatar";
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";
import SaveList from "./components/SaveList";
import axios from "axios";
import textFormat from "../scripts/textFormat";
import Loader from "./components/Loader";
import ServerDownMessage from "./components/ServiceDownMessage";

const Field = ({description, value}) => {
  return (
    <div style={{display: "flex", flexFlow: "row", justifyContent: "space-between"}}>
      <Typography variant="body1" color="primary">{description}:</Typography>
      <Typography variant="body1">{value}</Typography>
    </div>
  )
}
const ProfileCard = () => {
  const {getUser} = useContext(AuthContext);
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        paddingTop: "1rem",
        paddingBottom: "2rem"
      }}>
      <Typography gutterBottom={true} variant="h4" element="p">{getUser().username}</Typography>
      <MyAvatar size={100} />
    </Paper>
  )
}

// TODO - Retrieve user data from the server
const UserData = () => {
  const { getUser } = useContext(AuthContext);
  const [data, setData] = useState()
  const [error, setError] = useState(false)

  useEffect(() => {
    axios
      .get(`/user/${getUser().userId}`, {headers: {Authorization: `Bearer ${getUser().token}`}})
      .then(result => setData(Object.keys(result.data).map(x => {return {description: x, value: result.data[x]}})))
      .catch(() => setError(true))
    // eslint-disable-next-line
  }, [])

  const generateView = () => {
    if(error)
      return (<ServerDownMessage />)
    else
    if (!data)
      return (<Loader />)
    else
      return data.map((d, i) => {
        let value = d.value
        const date = new Date(value);
        if(!isNaN(date)) {
          value = date.toISOString().split("T")[0]
        }
        return <Field key={`data${i}`} description={textFormat(d.description)} value={value} />
      })
  }

  // TODO - If down show ServerDownMessage
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        gap: "1rem",
        paddingTop: "1rem",
        paddingBottom: "2rem"
      }}>
      <Typography variant="h4" element="p">User data</Typography>
      <Container>
        {generateView()}
      </Container>
    </Paper>
  )
}

const Buttons = () => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext);

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexFlow: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem"
      }}
    >
      <Button
        sx={{height: "fit-content"}}
        onClick={() => {navigate("/"); logout()}}
        startIcon={<LogoutIcon />}
      >
        <Typography variant="button">Logout</Typography>
      </Button>
    </Paper>
  )
}

const AccountPanel = () => {
  return (
    <Container sx={{display: "flex", flexFlow: "column", gap: "1rem"}}>
      <ProfileCard />
      <UserData />
      <Buttons />
    </Container>
  )
}

const HistoryPanel = () => {
  return (
    <Paper elevation={3} sx={{padding:"1rem 1rem 2rem"}}>
      <Typography variant="h3" component="p" sx={{textAlign: "center"}}>History</Typography>
      <SaveList />
    </Paper>
  )
}

export default function Account() {
  return (
    <>
      <ProtectedComponent />
      <Container
        component="main"
        sx={{
          marginTop: 4,
          display: "grid",
          gridTemplateColumns: "1fr 2fr"
        }}
      >
        <AccountPanel />
        <HistoryPanel />
      </Container>
    </>
  )
}