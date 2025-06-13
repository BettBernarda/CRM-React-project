import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import CustomTabPanel, { a11yProps } from "../components/CustomTabPanel";
import Tabelazona from "../components/Tabelazona";

export default function ItemsPage() {
  const [value, setValue] = useState(0);

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
          <Tabelazona labels={["id"]}></Tabelazona>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Tabelazona></Tabelazona>
        </CustomTabPanel>
      </Box>
  );
}