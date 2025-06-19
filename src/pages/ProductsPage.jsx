import { Box, Fab, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CustomTabPanel, { a11yProps } from "../components/CustomTabPanel";
import axios from "axios";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ItemsPage() {
  const navigate = useNavigate()

  const [value, setValue] = useState(0);
  const [productsList, setProductsList] = useState([])
  const [fornecedoresList, setFornecedoresList] = useState([])
  const [categoriasList, setCategoriasList] = useState([])

  useEffect(() => {
    axios.get(`/produtos`).then(response => setProductsList(response.data))
    axios.get(`/fornecedores`).then(response => setFornecedoresList(response.data))
    axios.get(`/categorias_produto`).then(response => setCategoriasList(response.data))
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const findFornecedorNameById = id => fornecedoresList.find(fornecedor => fornecedor.id == id).nome
  const findCategoriaNameById = id => categoriasList.find(categoria => categoria.id == id).nome

  return (
      <>
        <Typography variant="h4" gutterBottom>
          Produtos
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Vendidos" {...a11yProps(0)} />
              <Tab label="Em estoque" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Descrição</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Categoria</TableCell>
                    <TableCell align="right">Fornecedor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsList.map(product => (
                    <TableRow
                      key={product.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { cursor: 'pointer' }
                      }}
                      onClick={() => navigate(`/produtos/${product.id}`)}
                    >
                      <TableCell component="th" scope="row">{product.id}</TableCell>
                      <TableCell align="right">{product.status ? 'Ativo' : 'Inativo'}</TableCell>
                      <TableCell align="right">{product.descricao}</TableCell>
                      <TableCell align="right">{product.preco}</TableCell>
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
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Descrição</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Categoria</TableCell>
                    <TableCell align="right">Fornecedor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsList.map(product => (
                    <TableRow
                      key={product.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{product.id}</TableCell>
                      <TableCell align="right">{product.status ? 'Ativo' : 'Inativo'}</TableCell>
                      <TableCell align="right">{product.descricao}</TableCell>
                      <TableCell align="right">{product.preco}</TableCell>
                      <TableCell align="right">{product.categoria_id}</TableCell>
                      <TableCell align="right">{product.fornecedor_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
        </Box>
      </>
  );
}