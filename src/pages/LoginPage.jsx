import { useContext, useEffect, useState } from "react"
import { showMessageError } from "../utils/notification-utils"
import { login, UserContext } from "../context"
import { Box, Button, Card, CardContent, CardHeader, TextField, Typography } from "@mui/material"
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

    setUser({ ...user, email: user.email?.trim() })

    if (!user.email?.trim()) {
      showMessageError('Informe seu Email!')
      return
    }

    if (!user.senha) {
      showMessageError('Informe sua senha!')
      return
    }

    login(user, loggedUser, navigate, redirect)
  }

  const goToSignup = () => {
    if (redirect) {
      navigate(`/signup?redirect=${redirect}`)
    } else {
      navigate(`/signup`)
    }
  }

  return (
    <Box className="flex justify-center items-center mt-10 flex-col">
      <div className="m-10">
        <Typography variant="h2">Bem vindo de volta!</Typography>
      </div>
      <Card sx={{ width: '600px', maxWidth: '75vw' }}>
        <CardHeader title="Fazer login" />
        <CardContent>
          <Box
            component="form"
            noValidate
            onSubmit={handleSignin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              id="email"
              variant="outlined"
              value={user.email}
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Sehna"
              id="password"
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
              <Link className='hover:cursor-pointer' underline="hover" color="inherit" onClick={goToSignup}>
                Cadastre-se
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )

}