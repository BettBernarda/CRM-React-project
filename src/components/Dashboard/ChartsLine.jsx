import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Snackbar } from '@mui/material'; // This import is not directly used, SimpleSnackbar is.
import SimpleSnackbar from '../SnackBar'; // Corrected import for your custom Snackbar

function parseAnoMesParaDate(anoMes) {
  const [ano, mes] = anoMes.split('-').map(Number);
  return new Date(ano, mes - 1, 1);
} 

function formatMesLabel(date) {
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export default function ChartLine() {
  // ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL, UNCONDITIONALLY
  const [vendas, setVendas] = React.useState([]);
  const [vendaItens, setVendaItens] = React.useState([]);
  const [produtos, setProdutos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // MOVED THIS HERE!

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [vendasRes, vendaItensRes, produtosRes] = await Promise.all([
          fetch('http://localhost:3000/vendas'),
          fetch('http://localhost:3000/venda_itens'),
          fetch('http://localhost:3000/produtos'),
        ]);

        const [vendasData, vendaItensData, produtosData] = await Promise.all([
          vendasRes.json(),
          vendaItensRes.json(),
          produtosRes.json(),
        ]);

        setVendas(vendasData);
        setVendaItens(vendaItensData);
        setProdutos(produtosData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
        // Optionally, handle error state for user feedback
      }
    }

    fetchData();
  }, []);

  const vendasPorMes = React.useMemo(() => {
    // These checks are fine within useMemo as it's a conditional return of a value, not a hook.
    if (loading) return { labels: [], data: [] };
    if (!vendas.length || !vendaItens.length || !produtos.length)
      return { labels: [], data: [] };

    const precosPorProduto = {};
    produtos.forEach(({ id, preco }) => {
      precosPorProduto[id] = preco;
    });

    const valorPorVenda = {};
    vendaItens.forEach(({ venda_id, produto_id, quantidade }) => {
      const preco = precosPorProduto[produto_id] * quantidade || 0;
      valorPorVenda[venda_id] = (valorPorVenda[venda_id] || 0) + preco;
    });

    const totalPorMes = {};
    vendas.forEach(({ id, data_hora }) => {
      const data = new Date(data_hora);
      if (isNaN(data)) return;

      const anoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const valor = valorPorVenda[id] || 0;
      totalPorMes[anoMes] = (totalPorMes[anoMes] || 0) + valor;
    });

    const sortedMeses = Object.keys(totalPorMes).sort();

    const labels = sortedMeses.map((mes) => {
      const date = parseAnoMesParaDate(mes);
      return formatMesLabel(date);
    });
    const data = sortedMeses.map((mes) => totalPorMes[mes]);

    return { labels, data };
  }, [vendas, vendaItens, produtos, loading]);

  // Conditional rendering for loading/no data should come AFTER all hooks
  if (loading) return <p>Carregando dados...</p>;
  if (vendasPorMes.labels.length === 0) return <p>Nenhum dado para exibir.</p>;

  const handleClick = (e, d) => {
    const valor = vendasPorMes.data[d.dataIndex];
    if (valor === undefined) return;

    navigator.clipboard.writeText(valor.toString())
      .then(() => {
        setSnackbarOpen(true); // opens the snackbar
      })
      .catch((err) => console.error('Erro ao copiar:', err));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <LineChart
        xAxis={[{
          data: vendasPorMes.labels,
          label: 'Mês',
          scaleType: 'band',
          
          format: (value) => formatMesLabel(parseAnoMesParaDate(value)), 
        }]}
        series={[{
          data: vendasPorMes.data,
          label: 'Valor total vendido (R$)',
        }]}
        height={300}
        onMarkClick={handleClick}
      />

      <SimpleSnackbar
        open={snackbarOpen}
        message="Item copiado para o clipboard"
        onClose={handleSnackbarClose}
      />
    </>
  );
}