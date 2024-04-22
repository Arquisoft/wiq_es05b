import SearchIcon from '@mui/icons-material/Search';
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
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
    alignItems: "center",
}

const AddFriendTab = () => {
    const { getUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [sentRequests, setSentRequests] = useState([]);

    const fetchUsers = async (filter) => {
        if (!filter) filter = 'all';

        const response = await axios({
            method: 'get',
            url: `/users/search/${filter}`,
            headers: {
                'Authorization': `Bearer ${getUser().token}`
            }
        });
        console.log(response.data);
        setUsers(response.data.filter(user => user._id !== getUser().userId));
    }

    const sendFriendRequest = async (toId) => {

        try {
            const response = await axios({
                method: 'post',
                url: `/users/social/sendrequest`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                },
                data: {
                    name: getUser().username,
                    userId: getUser().userId,
                    toId: toId
                }
            });
            //show toastr
            getSentRequests();
        } catch (error) {
            console.log(error);
        }
    }

    const getSentRequests = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `/users/social/sentrequests/${getUser().userId}`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                }
            });
            console.log(response.data);
            setSentRequests(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchUsers();
        getSentRequests();
    }, []);

    return (
        <Container sx={tabStyle} >
            <Typography variant="h4" element="p">Add Friends</Typography>
            <Container sx={{ display: "flex", gap: "1rem", justifyContent: 'center' }}>
                <TextField label="Search users..." variant="standard" value={filter}
                    onChange={(event) => setFilter(event.target.value)} />
                <Button variant="contained" onClick={() => fetchUsers(filter)}><SearchIcon /></Button>
            </Container>

            <Container sx={{ padding: '2em', display: "flex", flexDirection: "column", gap: "1rem", overflowY: "scroll", height: "400px", width: "100%", alignItems: "center" }}>
                {users.map((user, index) => {
                    return (
                        <Paper elevation={3} key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", width: "90%" }}>
                            <Typography variant="body1" element="p">{user.username}</Typography>
                            <Button variant="contained" onClick={() => sendFriendRequest(user._id)} disabled={sentRequests.some(request => request.from.userId === getUser().userId && request.to.userId === user._id)}>Add Friend</Button>
                        </Paper>
                    )
                })}
            </Container>

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