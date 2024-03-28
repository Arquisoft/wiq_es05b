import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedComponent() {

  let { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated())
      return <Navigate to="/login" />;
    return null
}
