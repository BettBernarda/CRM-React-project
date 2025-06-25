import React, { useEffect, useState } from "react"
import {
  Box,
  Collapse,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import RequireLogin from "../components/RequireLogin"

function Row({ supplier, products }) {
  const [open, setOpen] = useState(false)
  const relatedProducts = products.filter(p => p.fornecedor_id == supplier.id)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{supplier.nome}</TableCell>
        <TableCell>{supplier.email}</TableCell>
        <TableCell>{supplier.telefone}</TableCell>
        <TableCell>{supplier.endereco}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Produtos fornecidos
              </Typography>
              <Table size="small" aria-label="produtos">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Estoque</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relatedProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.nome}</TableCell>
                      <TableCell>{product.descricao}</TableCell>
                      <TableCell>R$ {product.preco?.toFixed(2)}</TableCell>
                      <TableCell>{product.qtde ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/fornecedores').then(res => setSuppliers(res.data))
    axios.get('/produtos').then(res => setProducts(res.data))
  }, [])

  return (
    <>
      <RequireLogin />
      <Typography variant="h4" gutterBottom>
        Fornecedores
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map(supplier => (
              <Row key={supplier.id} supplier={supplier} products={products} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botão para redirecionar para criação de fornecedor */}
      <Box sx={{ '& > :not(style)': { m: 1 }, mt: 2 }} className="flex justify-end">
        <Tooltip title="Criar fornecedor">
          <Fab color="primary" aria-label="add" onClick={() => navigate('/fornecedores/novo')}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  )
}
