import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabelazona from './components/Tabelazona';
import CustomTabPanel from './components/tab';
import { a11yProps } from './components/tab';





export default function App() {
  const [value, setValue] = React.useState(0);

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
        <Tabelazona></Tabelazona>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Tabelazona></Tabelazona>
      </CustomTabPanel>
    </Box>
  );
}