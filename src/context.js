import axios from "axios";
import { createContext } from "react";
import { showMessageError, showMessageSuccess } from "./utils/notification-utils";

export const UserContext = createContext()

export const logout = (userContext, navigate) => {
  userContext.id = null
  sessionStorage.removeItem('userId')

  if (navigate) {
    navigate('/login')
  }
}

export const login = async (user, userContext, navigate, pageToRedirect = '') => {
  const result = await axios.get(`/usuarios?email=${user.email}&senha=${user.senha}&ativo=true`)
  const actualUser = result.data[0]

  if (!actualUser) {
    showMessageError('Não existe usuário com este cadastro')
    return
  }

  userContext.id = actualUser.id
  sessionStorage.setItem('userId', actualUser.id)
  showMessageSuccess('Login realizado com sucesso!')

  navigate(`/${pageToRedirect}`)
}