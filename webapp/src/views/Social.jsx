import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemove';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Container, Modal, Paper, TextField, Tooltip, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InfoSnackBAr from "./components/InfoSnackBar";
import ProtectedComponent from "./components/ProtectedComponent";
import UserAvatar from './components/UserAvatar';
import { AuthContext } from "./context/AuthContext";
const tabStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    justifyContent: "center",
    alignItems: "center",
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 12,
    p: 4,
}

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '.5em',
    transition: 'transform .3s ease-out',
    '&:hover': {
        transform: 'translate(10px, 0)',
    }
}

const rejectButtonStyle = {
    backgroundColor: 'palevioletred',
    '&:hover': {
        backgroundColor: '#c94d76',
    }
}

const profileStyle = {

}


const Menu = (props) => {
    const { openTab, friendRequests } = props;

    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Paper elevation={3} sx={{ display: "flex", flexFlow: "column", gap: "1rem", justifyContent: "center", alignItems: "flex-start", padding: "2rem 1rem" }}>
                <Box sx={menuItemStyle}>
                    <GroupIcon />
                    <Typography variant="h6" element="p" sx={{ cursor: "pointer" }} onClick={() => openTab("friendsTab")}>Friends</Typography>
                </Box>
                <Box sx={menuItemStyle}>
                    <GroupAddIcon />
                    <Typography variant="h6" element="p" sx={{ padding: 0, cursor: "pointer" }} onClick={() => openTab("friendRequests")}>Friend Requests</Typography>
                    {friendRequests.length != 0 && <NotificationAddOutlinedIcon sx={{ color: "palevioletred" }} />}
                </Box>
                <Box sx={menuItemStyle}>
                    <SearchIcon />
                    <Typography variant="h6" element="p" sx={{ cursor: "pointer" }} onClick={() => openTab("addFriendTab")}>Search users</Typography>
                </Box>


            </Paper>
        </Container>
    )
}

const AddFriendTab = (props) => {
    const { sentRequests, reloadSocialData, friends } = props;
    const { getUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [snackBarMsg, setSnackBarMsg] = useState('');

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
            setSnackBarMsg("Friend request sent!");
            reloadSocialData();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Container sx={tabStyle} >
            <Typography variant="h4" element="p">Add Friends</Typography>
            <Divider />

            <Container sx={{ display: "flex", gap: "1rem", justifyContent: 'center' }}>
                <TextField label="Search users..." variant="standard" value={filter}
                    onChange={(event) => setFilter(event.target.value)} />
                <Tooltip title="Search users">
                    <Button variant="contained" onClick={() => fetchUsers(filter)}><SearchIcon /></Button>
                </Tooltip>

            </Container>

            <Container sx={{ padding: '2em', display: "flex", flexDirection: "column", gap: "1rem", overflowY: "scroll", height: "400px", width: "100%", alignItems: "center" }}>
                {users.map((user, index) => {
                    return (
                        <Paper elevation={3} key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", width: "90%" }}>
                            <Typography variant="body1" element="p">{user.username}</Typography>
                            <Tooltip title="Send friend request">
                                <Button variant="contained" onClick={() => sendFriendRequest(user._id)} disabled={sentRequests.some(request => request.from.userId === getUser().userId && request.to.userId === user._id) || friends.some(f => f._id === user._id)}><GroupAddIcon /></Button>
                            </Tooltip>
                        </Paper>
                    )
                })}
            </Container>

            {snackBarMsg != '' && <InfoSnackBAr msg={snackBarMsg} setMsg={setSnackBarMsg} />}
        </Container>
    )
}

const FriendRequestsTab = props => {
    const { getUser } = useContext(AuthContext);
    const { friendRequests, reloadSocialData, parseDate } = props;

    const [accpetRequestSnackBarMsg, setAcceptRequestSnackBarMsg] = useState('');
    const [rejectRequestSnackBarMsg, setRejectRequestSnackBarMsg] = useState('');

    const acceptRequest = async (fromId) => {
        const toId = getUser().userId;
        try {
            const response = await axios({
                method: 'get',
                url: `/users/social/acceptrequest/${fromId}/${toId}`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                }
            });
            console.log(response.data);
            setAcceptRequestSnackBarMsg("Friend request accepted!");
            reloadSocialData();
        } catch (error) {
            console.log(error);
        }
    }

    const rejectRequest = async (fromId) => {
        const toId = getUser().userId;
        try {
            const response = await axios({
                method: 'post',
                url: `/users/social/rejectrequest`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                },
                data: {
                    fromId: fromId,
                    toId: toId
                }
            });
            console.log(response.data);
            setRejectRequestSnackBarMsg("Friend request rejected");
            reloadSocialData();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container sx={tabStyle}>
            <Typography variant="h4" element="p">Friend Requests</Typography>
            <Divider />

            {friendRequests.length === 0 ?
                <EmptyTabMessage />
                :
                <Container sx={{ padding: '2em', display: "flex", flexDirection: "column", gap: "1rem", overflowY: "scroll", height: "400px", width: "100%", alignItems: "center" }}>
                    {friendRequests.map((request, index) => {
                        return (
                            <Paper elevation={3} key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", width: "90%" }}>
                                <Typography variant="body1" element="p">{request.from.username}</Typography>
                                <Typography variant="body1" element="p">{parseDate(request.createdAt)}</Typography>
                                <Box sx={{ display: "flex", gap: "1em" }}>
                                    <Tooltip title="Accept friend request">
                                        <Button variant="contained" onClick={() => acceptRequest(request.from.userId)}><CheckIcon /></Button>
                                    </Tooltip>
                                    <Tooltip title="Reject friend request">
                                        <Button sx={rejectButtonStyle} variant="contained" onClick={() => rejectRequest(request.from.userId)}><CloseIcon /></Button>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        )
                    })}
                </Container>
            }
            {accpetRequestSnackBarMsg != '' && <InfoSnackBAr msg={accpetRequestSnackBarMsg} setMsg={setAcceptRequestSnackBarMsg} />}
            {rejectRequestSnackBarMsg != '' && <InfoSnackBAr msg={rejectRequestSnackBarMsg} setMsg={setRejectRequestSnackBarMsg} />}
        </Container>
    )
}

const FriendsTab = props => {
    const { friends, reloadSocialData, openProfile } = props;
    const { getUser } = useContext(AuthContext);

    const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
    const [friendToDelete, setFriendToDelete] = useState(null);
    const [removeFriendSnackMSg, setRemoveFriendSnackMSg] = useState('');

    const handleOpen = (friend) => {
        setFriendToDelete(friend);
        setShowRemoveFriendModal(true);
    }
    const handleClose = () => setShowRemoveFriendModal(false);

    const removeFriend = async (friendId) => {
        const userId = getUser().userId;
        try {
            const response = await axios({
                method: 'post',
                url: `/users/social/removefriend`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                },
                data: {
                    user1: userId,
                    user2: friendId
                }
            });
            setRemoveFriendSnackMSg("You and " + friendToDelete.username + " are no longer friends :(");
            reloadSocialData();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container sx={tabStyle}>
            <Typography variant="h4" element="p">Friends</Typography>
            <Divider />

            {friends.length === 0 ?
                <EmptyTabMessage />
                :
                <Container sx={{ padding: '2em', display: "flex", flexDirection: "column", gap: "1rem", overflowY: "scroll", height: "400px", width: "100%", alignItems: "center" }}>
                    {friends.map((friend, index) => {
                        return (
                            <Paper elevation={3} key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", width: "90%" }}>
                                <Box sx={{ display: "flex", gap: "1em", alignItems: 'center' }}>
                                    <UserAvatar username={friend.username} size={50} />
                                    <Typography variant="body1" element="p">{friend.username}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: "1em" }}>
                                    <Tooltip title="View profile">
                                        <Button variant="contained" onClick={() => openProfile(friend)} ><PersonIcon /></Button>
                                    </Tooltip>
                                    <Tooltip title="Remove friend">
                                        <Button variant="contained" onClick={() => handleOpen(friend)} ><PersonRemoveOutlinedIcon /></Button>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        )
                    })}
                    <RemoveFriendModal showRemoveFriendModal={showRemoveFriendModal} handleClose={handleClose} removeFriend={removeFriend} friendToDelete={friendToDelete} />
                </Container>
            }
            {removeFriendSnackMSg != '' && <InfoSnackBAr msg={removeFriendSnackMSg} setMsg={setRemoveFriendSnackMSg} />}
        </Container >
    );
}

const RemoveFriendModal = (props) => {
    const { showRemoveFriendModal, handleClose, removeFriend, friendToDelete } = props;

    if (friendToDelete)
        return (
            <Modal
                open={showRemoveFriendModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Removal confirmation
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure that you want to remove {friendToDelete.username} from your friend list?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: '1em', mt: 2 }}>
                        <Button variant="contained" onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" onClick={() => removeFriend(friendToDelete._id)}>Remove</Button>
                    </Box>
                </Box>
            </Modal>
        );
}

const EmptyTabMessage = () => {
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2em', gap: '1em' }}>

            <img src="/jordi-empty.jpg" alt="empty" style={{ width: '75%' }} />
            <Typography variant="h5" element="p">Oops... this seems to be empty</Typography>

        </Container>
    )
}

const UserProfile = (props) => {
    const { user, parseDate, openTab } = props;

    return (

        <Container sx={{ display: 'flex', flexDirection: 'column', gap: '0em', padding: '.5em' }}>
            <ArrowBackIcon sx={{ cursor: 'pointer', paddingTop: '.5em'}} onClick={() => openTab('friendsTab')} />
            <Box sx={{ display: 'flex', gap: '2em', alignItems: 'center', justifyContent:'center'}}>
                <Box sx={{ display: 'flex', gap: '1em' }}>
                    <UserAvatar username={user.username} size={100} />
                </Box>
                <Box sx={{ display: 'flex', gap: '.25em', flexDirection: 'column' }}>
                    <Typography variant="h4" element="p">{user.username}</Typography>
                    <Typography variant="body1" element="p">Joined: {parseDate(user.createdAt)}</Typography>
                </Box>
            </Box>

            <Divider sx={{padding:'.5em'}}/>

        </Container>

    )
}


export default function Social() {
    const { getUser } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState("friendsTab");
    const [sentRequests, setSentRequests] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [reloadData, setReloadData] = useState(false);

    const [openedProfileUser, setOpenedProfileUser] = useState(null);

    useEffect(() => {
        getSentRequests();
        getFriendRequests();
        getFriends();
    }, [reloadData]);

    const reloadSocialData = () => {
        setReloadData(!reloadData);
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

    const getFriendRequests = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `/users/social/receivedrequests/${getUser().userId}`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                }
            });
            console.log(response.data);
            setFriendRequests(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getFriends = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `/users/social/friends/${getUser().userId}`,
                headers: {
                    Authorization: `Bearer ${getUser().token}`
                }
            });
            parseFriends(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const parseFriends = (friendships) => {
        const friends = [];
        for (let friendship of friendships) {
            if (friendship.user1._id === getUser().userId)
                friends.push(friendship.user2);
            else
                friends.push(friendship.user1);
        }
        setFriends(friends);
    }

    const openProfile = (user) => {
        setOpenedProfileUser(user);
    }

    const openTab = (tab) => {
        setOpenedProfileUser(null);
        setSelectedTab(tab);
    }

    const parseDate = rawDate => {
        const date = new Date(rawDate);
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    }

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

                <Menu openTab={openTab} friendRequests={friendRequests} />
                <Paper elevation={3} sx={{
                    height: "100%",
                }} >
                    {selectedTab === "friendsTab" && !openedProfileUser && <FriendsTab friends={friends} reloadSocialData={reloadSocialData} openProfile={openProfile} />}
                    {selectedTab === "addFriendTab" && !openedProfileUser && <AddFriendTab sentRequests={sentRequests} reloadSocialData={reloadSocialData} friends={friends} />}
                    {selectedTab === "friendRequests" && !openedProfileUser && <FriendRequestsTab friendRequests={friendRequests} reloadSocialData={reloadSocialData} parseDate={parseDate} />}
                    {openedProfileUser && <UserProfile user={openedProfileUser} parseDate={parseDate} openTab={openTab} />}
                </Paper>

            </Container>
        </ProtectedComponent>
    )
}