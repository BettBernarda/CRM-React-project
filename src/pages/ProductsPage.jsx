import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import CustomTabPanel, { a11yProps } from "../components/CustomTabPanel";
import DataTable from "../components/DataTable";
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
          <DataTable 
            items={productsList}
            fields={["id", "status", "descricao", "preco", "categoria_id", "fornecedor_id"]}
            labels={["ID", "Status", "Descrição", "Preço", "Categoria", "Fornecedor"]} 
          >
          </DataTable>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DataTable 
            items={productsList}
            fields={["id", "status", "descricao", "preco", "categoria_id", "fornecedor_id"]}
            labels={["ID", "Status", "Descrição", "Preço", "Categoria", "Fornecedor"]} 
          >
          </DataTable>
        </CustomTabPanel>
      </Box>
  );
}