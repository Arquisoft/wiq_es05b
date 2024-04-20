import { Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProtectedComponent from "./components/ProtectedComponent";
import { AuthContext } from "./context/AuthContext";


const Menu = (props) => {
    const { setSelectedTab } = props;

    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Paper elevation={3} sx={{ display: "flex", flexFlow: "column", gap: "1rem", justifyContent: "center", alignItems: "flex-start", padding: "2rem 1rem" }}>
                <Typography variant="h6" element="p" sx={{ cursor: "pointer" }} onClick={() => setSelectedTab("friendsTab")}>Friends</Typography>
                <Typography variant="h6" element="p" sx={{ cursor: "pointer" }} onClick={() => setSelectedTab("groupsTab")}>Groups</Typography>
                <Typography variant="h6" element="p" sx={{ cursor: "pointer" }} onClick={() => setSelectedTab("addFriendTab")}>Add Friend</Typography>
                <Typography variant="h6" element="p" sx={{ cursor: "pointer" }} onClick={() => setSelectedTab("joinGroupTab")}>Join Group</Typography>
            </Paper>
        </Container>
    )
}

const tabStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    justifyContent: "center",
    alignItems: "center"
}

const AddFriendTab = () => {
    const {getUser} = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = async (filter) => {
        if (!filter) filter = 'all';

        const response = await axios({
            method: 'get',
            url: `/users/search/${filter}`,
            headers: {
                'Authorization': `Bearer ${getUser().token}`
            }});

        setUsers(response.data);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Container sx={tabStyle} >
            <Typography variant="h4" element="p">Add Frieeends</Typography>
            <TextField label="Search users..." variant="standard" />

        </Container>
    )
}


export default function Social() {
    const [selectedTab, setSelectedTab] = useState("addFriendTab")

    return (
        <ProtectedComponent>
            <Container
                component="main"
                sx={{
                    marginTop: 4,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    height: "600px"
                }}
            >

                <Menu setSelectedTab={setSelectedTab} />
                <Paper elevation={3} sx={{
                    height: "100%",
                }} >
                    {selectedTab === "friendsTab" && <Typography variant="h6" element="p">Friends</Typography>}
                    {selectedTab === "groupsTab" && <Typography variant="h6" element="p">Groups</Typography>}
                    {selectedTab === "addFriendTab" && <AddFriendTab />}
                    {selectedTab === "joinGroupTab" && <Typography variant="h6" element="p">Join Group</Typography>}
                </Paper>

            </Container>
        </ProtectedComponent>
    )
}