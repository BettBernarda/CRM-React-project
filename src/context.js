import { createContext } from "react";

export const UserContext = createContext()

export const logout = (userContext, navigate) => {
  userContext.id = null
  localStorage.removeItem('userId')

  if (navigate) {
    navigate('/login')
  }
}