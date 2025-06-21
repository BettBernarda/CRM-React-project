import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { showMessageError, showMessageSuccess } from "../utils/notification-utils"
import { UserContext } from "../context"
import { Box, Button, Card, CardContent, CardHeader, TextField } from "@mui/material"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

export default function SignupPage() {
  const [user, setUser] = useState({})
  const [confirmedPassword, setConfirmedPassword] = useState('')

  const loggedUser = useContext(UserContext)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? ''

  useEffect(() => {
    if (loggedUser.id) {
      navigate(`/${redirect}`)
    }
  }, [loggedUser.id, navigate, redirect])
  
  const handleSignup = async (e) => {
    e.preventDefault()

    if (!user.nome) {
      showMessageError('É necessário preencher o nome!')
      return
    }

    if (!user.email) {
      showMessageError('É necessário preencher o email!')
      return
    }

    if (user.senha !== confirmedPassword) {
      showMessageError('Ambas as senhas devem ser iguais!')
      return
    }

    const userWithSameEmail = (await axios.get(`/usuarios?email=${user.email}`)).data
    if (userWithSameEmail.length) {
      showMessageError('Já existe um usuário cadastrado com este Email!')
      return
    }

    const now = new Date()
    const result = await axios.post('/usuarios', { ...user, id: uuidv4(), created_at: now, updated_at: now })

    if (result.data) {
      showMessageSuccess('Cadastro realizado com sucesso!')
      login()
    }
  }

  const login = async () => {
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

  const goToLogin = () => {
    if (redirect) {
      navigate(`/login?redirect=${redirect}`)
    } else {
      navigate(`/login`)
    }
  }

  return (
    <Box className="flex justify-center mt-10">
      <Card sx={{ width: '600px', maxWidth: '75vw' }}>
        <CardHeader title="Crie sua Conta" />
        <CardContent>
          <Box
            component="form"
            noValidate
            onSubmit={handleSignup}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Nome"
              id="name"
              variant="outlined"
              value={user.nome}
              required
              onChange={(e) => setUser({ ...user, nome: e.target.value })}
              fullWidth
            />
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
            <TextField
              label="Confirme sua Senha"
              id="confirm-password"
              variant="outlined"
              value={confirmedPassword}
              required
              type="password"
              onChange={(e) => setConfirmedPassword(e.target.value)}
              fullWidth
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Cadastre-se
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              Já tem uma conta?
              <Link className='hover:cursor-pointer' underline="hover" color="inherit" onClick={goToLogin}>
                Entrar
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )

}