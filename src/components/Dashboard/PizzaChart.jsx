
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Paper, Box, Typography, Stack } from '@mui/material';

const cores = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a569bd', '#f1948a'];

export default function GraficoCategoriasFiltravel({ onCategoriaSelecionada }) {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const resProdutos = await axios.get('http://localhost:3000/produtos');
      const resCategorias = await axios.get('http://localhost:3000/categorias_produto');

      const categorias = resCategorias.data;
      const produtos = resProdutos.data;

      const contagem = categorias.map((cat, i) => {
        const total = produtos.filter(p => p.categoria_id === cat.id).length;
        return {
          id: cat.id,
          nome: cat.nome,
          valor: total,
          cor: cores[i % cores.length]
        };
      }).filter(c => c.valor > 0);

      setData(contagem);
      setCategorias(contagem);
    }

    fetchData();
  }, []);

  const handleClick = (data, index) => {
    const categoria = categorias[index];
    onCategoriaSelecionada(categoria.id);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', flex: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
          Produtos por Categoria (clique para filtrar)
        </Typography>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="valor"
            nameKey="nome"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Paper>

      {/* LEGENDA */}
      <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Legenda</Typography>
        <Stack spacing={1}>
          {data.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: item.cor, mr: 1 }} />
              <Typography sx={{ color: 'white' }}>{item.nome}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
