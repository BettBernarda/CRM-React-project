import { useContext } from "react";
import { UserContext } from "../../context";
import { useLocation, useNavigate } from "react-router-dom";

export default function RequireLogin() {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  if (!userContext.id) {
    navigate(`/login?redirect=${location.pathname.substring(1)}`)
  }
}