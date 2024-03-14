import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../App";

export default function Logout() {
    const { logout } = useContext(AuthContext);
    logout()

    return <Navigate to="/login" />
}