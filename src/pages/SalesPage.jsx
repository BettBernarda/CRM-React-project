import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RequireLogin from "../components/RequireLogin"
import {
  Box,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Collapse,
  IconButton
} from "@mui/material"
import { Add as AddIcon, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { formatCurrency } from "../utils/format-utils"

export default function SalesPage() {
  const navigate = useNavigate()

  const [productsList, setProductsList] = useState([])
  const [customersList, setCustomersList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [openRows, setOpenRows] = useState({})

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
      if (!item.product) return total
      return total + item.product.preco * item.qtde
    }, 0.00)

    return formatCurrency(saleTotal)
  }

  const toggleRow = (id) => {
    setOpenRows(prev => ({ ...prev, [id]: !prev[id] }))
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
          <Table sx={{ minWidth: 650 }} aria-label="tabela de vendas">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell align="right">Cliente</TableCell>
                <TableCell align="right">Data</TableCell>
                <TableCell align="right">Valor Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {salesList
    .filter(sale => findCustomerNameById(sale.cliente_id).toUpperCase().includes(searchText.toUpperCase()))
    .map((sale) => (
      <>
        <TableRow key={sale.id}>
          <TableCell>
            <IconButton size="small" onClick={() => toggleRow(sale.id)}>
              {openRows[sale.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{sale.id}</TableCell>
          <TableCell align="right">{findCustomerNameById(sale.cliente_id)}</TableCell>
          <TableCell align="right">{new Date(sale.data_hora).toLocaleString('pt-BR')}</TableCell>
          <TableCell align="right">{findFormattedSaleTotal(sale)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={openRows[sale.id]} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Itens da Venda
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Preço</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sale.itens.map((item, index) => {
                      const product = productsList.find(p => p.id === item.produto_id)
                      if (!product) return null

                      const subtotal = product.preco * item.qtde

                      const handleUpdate = async (newItens) => {
                        try {
                          await axios.put(`/vendas/${sale.id}`, {
                            ...sale,
                            itens: newItens
                          })
                          setSalesList(prev => prev.map(s => s.id === sale.id ? { ...sale, itens: newItens } : s))
                        } catch (error) {
                          alert("Erro ao atualizar venda.")
                          console.error(error)
                        }
                      }

                      return (
                        <TableRow key={index}>
                          <TableCell>{product.nome}</TableCell>
                          <TableCell align="right">{formatCurrency(product.preco)}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              size="small"
                              value={item.qtde}
                              onChange={(e) => {
                                const qtde = Number(e.target.value)
                                if (qtde >= 1) {
                                  const newItens = [...sale.itens]
                                  newItens[index].qtde = qtde
                                  handleUpdate(newItens)
                                }
                              }}
                              inputProps={{ min: 1 }}
                              sx={{ width: '60px' }}
                            />
                          </TableCell>
                          <TableCell align="right">{formatCurrency(subtotal)}</TableCell>
                          <TableCell align="right">
                            <button
                              onClick={() => {
                                const newItens = sale.itens.filter((_, i) => i !== index)
                                handleUpdate(newItens)
                              }}
                            >
                              Remover
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
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
  )
}
