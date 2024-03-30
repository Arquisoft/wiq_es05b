import ProtectedComponent from "./components/ProtectedComponent";
import {Button, Container, Divider, Paper, Typography} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import MyAvatar from "./components/MyAvatar";
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";

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
  const data = [
    {description: "Username", value: "admin"},
    {description: "Email", value: "admin@localhost"},
    {description: "Created at", value: new Date().getFullYear()},
  ]
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexFlow: "column",
        // justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        paddingTop: "1rem",
        paddingBottom: "2rem"
      }}>
      <Typography variant="h4" element="p">User data</Typography>
      <Container>
        {
          data.map((d, i) =>
            <Field key={`data${i}`} description={d.description} value={d.value}/>
          )
        }
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
      >
        <LogoutIcon />
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
    <Paper>
      <Typography variant="h3" component="p">History</Typography>
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
          gridTemplateColumns: "1fr 2fr",
          gridColumnGap: "1rem",
          height: "82vh"
        }}
      >
        <AccountPanel />
        <HistoryPanel />
      </Container>
    </>
  )
}