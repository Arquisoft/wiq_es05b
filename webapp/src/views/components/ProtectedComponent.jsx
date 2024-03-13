import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router";

export default function ProtectedComponent() {

  let { user: user } = useContext(AuthContext);

    if (!user || user === "")
      return <Navigate to="/login" />;
    return null
}
