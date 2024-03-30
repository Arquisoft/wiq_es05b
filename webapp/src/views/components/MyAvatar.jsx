import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {Avatar} from "@mui/material";

const MyAvatar = ({size}) => {
  const { isAuthenticated, getUser } = useContext(AuthContext)
  if (!isAuthenticated()) return <Avatar alt="Suspicious User"></Avatar>
  return (
    <Avatar alt={getUser()["username"]} sx={{height: size || 40, width: size || 40}}>
      {getUser()["username"] ? getUser()["username"].charAt(0) : ""}
    </Avatar>
  )
}

export default MyAvatar