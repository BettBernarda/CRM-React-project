import { Box, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RequireLogin from "../components/Dashboard/RequireLogin";

export default function ProductsPage() {
  const navigate = useNavigate()

  const [productsList, setProductsList] = useState([])
  const [fornecedoresList, setFornecedoresList] = useState([])
  const [categoriasList, setCategoriasList] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    axios.get(`/produtos`).then(response => setProductsList(response.data))
    axios.get(`/fornecedores`).then(response => setFornecedoresList(response.data))
    axios.get(`/categorias_produto`).then(response => setCategoriasList(response.data))
  }, [])

  const findFornecedorNameById = id => fornecedoresList.find(fornecedor => fornecedor.id == id)?.nome ?? 'N/A'
  const findCategoriaNameById = id => categoriasList.find(categoria => categoria.id == id)?.nome ?? 'N/A'

  return (
      <>
        <RequireLogin />
        <Typography variant="h4" gutterBottom>
          Produtos
        </Typography>
        <TextField fullWidth
            label="Pesquise por um produto"
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
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Descrição</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Categoria</TableCell>
                  <TableCell align="right">Fornecedor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsList
                  .filter(product => product.nome.toUpperCase().includes(searchText.toUpperCase()))
                  .map(product => (
                  <TableRow
                    key={product.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { cursor: 'pointer' }
                    }}
                    onClick={() => navigate(`/produtos/${product.id}`)}
                  >
                    <TableCell component="th" scope="row">{product.id}</TableCell>
                    <TableCell align="right">{product.nome}</TableCell>
                    <TableCell align="right">{product.status ? 'Ativo' : 'Inativo'}</TableCell>
                    <TableCell align="right">{product.descricao}</TableCell>
                    <TableCell align="right">{product.preco}</TableCell>
                    <TableCell align="right">{product.qtde}</TableCell>
                    <TableCell align="right">{findCategoriaNameById(product.categoria_id)}</TableCell>
                    <TableCell align="right">{findFornecedorNameById(product.fornecedor_id)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ '& > :not(style)': { m: 1 } }} className="flex justify-end">
            <Tooltip title="Criar produto" onClick={() => navigate('/produtos/novo')}>
              <Fab color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
      </>
  );
}