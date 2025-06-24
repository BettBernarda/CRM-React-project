
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

export default function TabelaTopVendas({ categoriaSelecionada }) {
  const [categorias, setCategorias] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const resVendas = await axios.get('http://localhost:3000/vendas');
      const resProdutos = await axios.get('http://localhost:3000/produtos');
      const rescategorias = await axios.get('http://localhost:3000/categorias_produto')

      setCategorias(rescategorias.data);
      setVendas(resVendas.data);
      setProdutos(resProdutos.data);
    }
    fetchData();
  }, []);




  const nomeCategoriaSelecionada = categoriaSelecionada
    ? categorias.find(cat => cat.id === categoriaSelecionada)?.nome
    : null;

  const somarVendas = () => {
    const contagem = {};

    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produto_id);
        if (!produto) return;

        if (categoriaSelecionada && produto.categoria_id !== categoriaSelecionada) return;

        if (!contagem[produto.id]) {
          contagem[produto.id] = {
            nome: produto.nome,
            qtde: 0
          };
        }
        contagem[produto.id].qtde += item.qtde;
      });
    });

    return Object.entries(contagem)
      .map(([id, dados]) => ({ id, ...dados }))
      .sort((a, b) => b.qtde - a.qtde)
      .slice(0, 5);
  };

  const topProdutos = somarVendas();

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
      <Typography variant="h6" sx={{ m: 2, color: 'white' }}>
        {categoriaSelecionada ? `Top Vendas de ${nomeCategoriaSelecionada}` : 'Top 5 Produtos Vendidos'}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'white' }}>Produto</TableCell>
            <TableCell sx={{ color: 'white' }}>Quantidade Vendida</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topProdutos.map(produto => (
            <TableRow key={produto.id}>
              <TableCell sx={{ color: 'white' }}>{produto.nome}</TableCell>
              <TableCell sx={{ color: 'white' }}>{produto.qtde}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
