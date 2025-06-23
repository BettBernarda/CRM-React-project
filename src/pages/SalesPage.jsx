import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RequireLogin from "../components/Dashboard/RequireLogin"
import { Box, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"

export default function SalesPage() {
  const navigate = useNavigate()

  const [productsList, setProductsList] = useState([])
  const [customersList, setCustomersList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [saleItemsList, setSaleItemsList] = useState([])
  const [searchText, setSearchText] = useState('')

  const moneyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  useEffect(() => {
    axios.get(`/vendas`).then(response => setSalesList(response.data))
    axios.get(`/venda_itens`).then(response => setSaleItemsList(response.data))
    axios.get(`/produtos`).then(response => setProductsList(response.data))
    axios.get(`/clientes`).then(response => setCustomersList(response.data))
  }, [])

  const findCustomerNameById = id => customersList.find(customer => customer.id == id)?.nome ?? 'N/A'

  const findFormattedSaleTotal = saleId => {
    const saleItems = saleItemsList.filter(saleItem => saleItem.venda_id == saleId)
    const saleItemProducts = saleItems.map(saleItem => productsList.find(product => product.id == saleItem.produto_id))

    const saleTotal = saleItemProducts.reduce((total, product) => total + product.preco, 0)

    return moneyFormatter.format(saleTotal)
  }

  return (
      <>
        <RequireLogin />
        <Typography variant="h4" gutterBottom>
          Produtos
        </Typography>
        <TextField fullWidth
            label="Pesquise por uma categoria"
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
                  .map(sale => (
                  <TableRow
                    key={sale.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { cursor: 'pointer' }
                    }}
                    onClick={() => navigate(`/produtos/${sale.id}`)}
                  >
                    <TableCell component="th" scope="row">{sale.id}</TableCell>
                    <TableCell align="right">{findCustomerNameById(sale.cliente_id)}</TableCell>
                    <TableCell align="right">{new Date(sale.data_hora).toLocaleString('pt-BR')}</TableCell>
                    <TableCell align="right">{findFormattedSaleTotal(sale.id)}</TableCell>
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