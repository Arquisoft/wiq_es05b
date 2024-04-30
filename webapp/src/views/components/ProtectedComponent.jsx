import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedComponent({children}) {

  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated()) return <Navigate to="/login" />
  return children
}
