import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { showMessageError, showMessageSuccess } from "../utils/notification-utils"
import { UserContext } from "../context"
import { Box, Button, Card, CardContent, CardHeader, TextField } from "@mui/material"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function LoginPage() {
  const [user, setUser] = useState({})
  const loggedUser = useContext(UserContext)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? ''

  useEffect(() => {
    if (loggedUser.id) {
      navigate(`/${redirect}`)
    }
  }, [loggedUser, navigate, redirect])
  
  const handleSignin = async (e) => {
    e.preventDefault()

    const result = await axios.get(`/usuarios?email=${user.email}&senha=${user.senha}&ativo=true`)
    const actualUser = result.data[0]

    if (!actualUser) {
      showMessageError('Não existe usuário com este cadastro')
      return
    }

    loggedUser.id = actualUser.id
    sessionStorage.setItem('userId', actualUser.id)
    showMessageSuccess('Login realizado com sucesso!')

    navigate(`/${redirect}`)
  }

  return (
    <Box className="flex justify-center mt-10">
      <Card sx={{ width: '600px', maxWidth: '75vw' }}>
        <CardHeader title="Fazer login" />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSignin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              variant="outlined"
              value={user.email}
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Sehna"
              variant="outlined"
              value={user.senha}
              required
              type="password"
              onChange={(e) => setUser({ ...user, senha: e.target.value })}
              fullWidth
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Entrar
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              Não tem uma conta?
              <Link className='hover:cursor-pointer' underline="hover" color="inherit">
                Cadastre-se
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )

}