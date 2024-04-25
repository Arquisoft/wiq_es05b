import { Avatar } from "@mui/material";
import React from "react";

const UserAvatar = ({ size, username}) => {
    return (
        <Avatar alt={username} sx={{ height: size || 40, width: size || 40 }}>
            {username? username.charAt(0) : ""}
        </Avatar>
    )
}

export default UserAvatar