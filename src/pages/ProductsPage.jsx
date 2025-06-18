import { Box, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import CustomTabPanel, { a11yProps } from "../components/CustomTabPanel";
import axios from "axios";

export default function ItemsPage() {
  const [value, setValue] = useState(0);
  const [productsList, setProductsList] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:3000/produtos`).then(response => setProductsList(response.data))
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >{console.log(product)}
                    <TableCell component="th" scope="row">{product.id.toString()}</TableCell>
                    <TableCell align="right">{product.status.toString()}</TableCell>
                    <TableCell align="right">{product.descricao.toString()}</TableCell>
                    <TableCell align="right">{product.preco.toString()}</TableCell>
                    <TableCell align="right">{product.categoria_id.toString()}</TableCell>
                    <TableCell align="right">{product.fornecedor_id.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
                  >{console.log(product)}
                    <TableCell component="th" scope="row">{product.id.toString()}</TableCell>
                    <TableCell align="right">{product.status.toString()}</TableCell>
                    <TableCell align="right">{product.descricao.toString()}</TableCell>
                    <TableCell align="right">{product.preco.toString()}</TableCell>
                    <TableCell align="right">{product.categoria_id.toString()}</TableCell>
                    <TableCell align="right">{product.fornecedor_id.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
      </Box>
  );
}