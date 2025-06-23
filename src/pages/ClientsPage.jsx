import { Add as AddIcon } from "@mui/icons-material"
import { Box, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RequireLogin from "../components/Dashboard/RequireLogin"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function ClientsPage() {
  const [clientList, setClientList] = useState([])
  const [searchText, setSearchText] = useState('')

  const navigate = useNavigate()
  
  useEffect(() => {
    axios.get(`/clientes`).then(response => setClientList(response.data))
  }, [])

  return (
    <>
      <RequireLogin />
      <Typography variant="h4" gutterBottom>
        Clientes
      </Typography>
      <TextField fullWidth
          label="Pesquise por um cliente"
          type="search"
          variant="standard"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      <Box sx={{ width: '100%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Nome</TableCell>
                <TableCell align="right">E-mail</TableCell>
                <TableCell align="right">Senha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientList
                .filter(cliente => cliente.nome.toUpperCase().includes(searchText.toUpperCase()))
                .map(cliente => (
                  <TableRow
                    key={cliente.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { cursor: 'pointer' }
                    }}
                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                  >
                    <TableCell component="th" scope="row">{cliente.id}</TableCell>
                    <TableCell align="right">{cliente.nome}</TableCell>
                    <TableCell align="right">{cliente.email}</TableCell>
                    <TableCell align="right">{cliente.senha}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ '& > :not(style)': { m: 1 } }} className="flex justify-end">
          <Tooltip title="Criar cliente" onClick={() => navigate('/clientes/novo')}>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
    </>
  )
}