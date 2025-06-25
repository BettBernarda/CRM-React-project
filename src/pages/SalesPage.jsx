import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RequireLogin from "../components/RequireLogin"
import { Box, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { formatCurrency } from "../utils/format-utils"

export default function SalesPage() {
  const navigate = useNavigate()

  const [productsList, setProductsList] = useState([])
  const [customersList, setCustomersList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    axios.get(`/vendas`).then(response => setSalesList(response.data))
    axios.get(`/produtos`).then(response => setProductsList(response.data))
    axios.get(`/clientes`).then(response => setCustomersList(response.data))
  }, [])

  const findCustomerNameById = id => customersList.find(customer => customer.id == id)?.nome ?? 'N/A'

 const findFormattedSaleTotal = (sale) => {
  const saleItemsWithQtde = sale.itens.map(item => {
    const product = productsList.find(product => product.id == item.produto_id)
    return { product, qtde: item.qtde }
  })

  const saleTotal = saleItemsWithQtde.reduce((total, item) => {
    if (!item.product) return total // ignora itens com produto não encontrado
    return total + item.product.preco * item.qtde
  }, 0.00)

  return formatCurrency(saleTotal)
}


  return (
      <>
        <RequireLogin />
        <Typography variant="h4" gutterBottom>
          Vendas
        </Typography>
        <TextField fullWidth
            label="Encontre uma venda pelo nome do cliente"
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
                  <TableCell align="right">Cliente</TableCell>
                  <TableCell align="right">Data</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesList
                  .filter(sale => findCustomerNameById(sale.cliente_id).toUpperCase().includes(searchText.toUpperCase()))
                  .map(sale => (
                  <TableRow
                    key={sale.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { cursor: 'pointer' }
                    }}
                    onClick={() => navigate(`/vendas/${sale.id}`)}
                  >
                    <TableCell component="th" scope="row">{sale.id}</TableCell>
                    <TableCell align="right">{findCustomerNameById(sale.cliente_id)}</TableCell>
                    <TableCell align="right">{new Date(sale.data_hora).toLocaleString('pt-BR')}</TableCell>
                    <TableCell align="right">{findFormattedSaleTotal(sale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ '& > :not(style)': { m: 1 } }} className="flex justify-end">
            <Tooltip title="Criar produto" onClick={() => navigate('/vendas/novo')}>
              <Fab color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
      </>
  );
}