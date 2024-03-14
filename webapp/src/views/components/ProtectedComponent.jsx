import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router";

export default function ProtectedComponent() {

  let { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated())
      return <Navigate to="/login" />;
    return null
}
