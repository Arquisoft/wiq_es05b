import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../App";

export default function Logout() {
    const { setUser } = useContext(AuthContext);
    setUser(null)

    return <Navigate to="/login" />
}