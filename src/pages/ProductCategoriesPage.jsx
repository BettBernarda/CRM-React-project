import { Add as AddIcon } from "@mui/icons-material"
import { Box, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ProductCategoriesPage() {
  const [categoriasList, setCategoriasList] = useState([])

  const navigate = useNavigate()
  
  useEffect(() => {
    axios.get(`/categorias_produto`).then(response => setCategoriasList(response.data))
  }, [])

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Categorias de Produtos
      </Typography>
      <Box sx={{ width: '100%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Nome</TableCell>
                <TableCell align="right">Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriasList.map(categoria => (
                <TableRow
                  key={categoria.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { cursor: 'pointer' }
                  }}
                  onClick={() => navigate(`/produtos/categorias/${categoria.id}`)}
                >
                  <TableCell component="th" scope="row">{categoria.id}</TableCell>
                  <TableCell align="right">{categoria.nome}</TableCell>
                  <TableCell align="right">{categoria.descricao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ '& > :not(style)': { m: 1 } }} className="flex justify-end">
          <Tooltip title="Criar produto" onClick={() => navigate('/produtos/categorias/novo')}>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
    </>
  )
}