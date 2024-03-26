import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../App";

export default function Logout() {
    // FIXME - Move to the logout button and remove component to prevent error (see browser console)
    const { logout } = useContext(AuthContext);
    logout()

    return <Navigate to="/login" />
}