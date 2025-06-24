import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ChartLine({ categoriaSelecionada }) {
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vendasRes, produtosRes] = await Promise.all([
          fetch('http://localhost:3000/vendas'),
          fetch('http://localhost:3000/produtos'),
        ]);

        const [vendasData, produtosData] = await Promise.all([
          vendasRes.json(),
          produtosRes.json(),
        ]);

        setVendas(vendasData);
        setProdutos(produtosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchData();
  }, []);

  const data = useMemo(() => {
    // Mapeia produto_id para preço e categoria
    const produtoInfo = produtos.reduce((acc, produto) => {
      acc[produto.id] = { preco: produto.preco || 0, categoria_id: produto.categoria_id };
      return acc;
    }, {});

    const vendasPorMes = {};

    vendas.forEach((venda) => {
      const dataVenda = new Date(venda.data_hora);
      const anoMes = `${dataVenda.getFullYear()}-${String(dataVenda.getMonth() + 1).padStart(2, '0')}`;

      let totalVenda = 0;

      if (Array.isArray(venda.itens)) {
        venda.itens.forEach(({ produto_id, qtde }) => {
          const info = produtoInfo[produto_id];
          if (!info) return;

          // Filtra por categoria selecionada
          if (categoriaSelecionada && info.categoria_id !== categoriaSelecionada) return;

          totalVenda += info.preco * qtde;
        });
      }

      vendasPorMes[anoMes] = (vendasPorMes[anoMes] || 0) + totalVenda;
    });

    return Object.entries(vendasPorMes).map(([anoMes, total]) => ({
      mes: anoMes,
      "Valor total vendido R$": Math.round(total), // arredonda para inteiro
    }));
  }, [vendas, produtos, categoriaSelecionada]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3 className="text-xl font-semibold mb-2">Total de vendas por mês</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Valor total vendido R$" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartLine;
