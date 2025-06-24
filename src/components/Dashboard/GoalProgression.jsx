import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Stack, LinearProgress, Typography, Box, Button } from '@mui/material';

export const formatCurrency = (val) => {
  const num = Number(val.replace(/\D/g, '')) / 100;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export default function MetaProgressao({ categoriaSelecionada }) {
  const currentYear = new Date().getFullYear();
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(''); // em centavos
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);

  const inputRef = useRef(null);
  const apiMeta = 'http://localhost:3000/Metas';

  // Pega a meta anual
  useEffect(() => {
    setLoadingMeta(true);
    axios.get(apiMeta, { params: { id: currentYear } })
      .then(res => {
        if (res.data.length > 0) {
          const meta = res.data[0];
          setValue(String(meta.value * 100));
        } else {
          setValue('');
        }
      })
      .catch(err => console.error('Erro ao buscar a meta:', err))
      .finally(() => setLoadingMeta(false));
  }, [currentYear]);

  // Pega vendas e produtos
  useEffect(() => {
    setLoadingDados(true);
    Promise.all([
      axios.get('http://localhost:3000/vendas'),
      axios.get('http://localhost:3000/produtos'),
    ]).then(([resVendas, resProdutos]) => {
      setVendas(resVendas.data);
      setProdutos(resProdutos.data);
    }).catch(err => console.error('Erro ao buscar vendas/produtos:', err))
      .finally(() => setLoadingDados(false));
  }, []);

  const parseCurrency = (formatted) => formatted.replace(/\D/g, '');

  const handleChange = (e) => {
    const onlyNumbers = parseCurrency(e.target.value);
    setValue(onlyNumbers);
  };

  const turnOnEditMode = () => setIsEditMode(true);

  const turnOffEditMode = async () => {
    setIsEditMode(false);
    const numericValue = Number(value) / 100;

    try {
      const res = await axios.get(apiMeta, { params: { id: currentYear } });

      if (res.data.length > 0) {
        const metaExistente = res.data[0];
        await axios.put(`${apiMeta}/${metaExistente.id}`, {
          id: metaExistente.id,
          value: numericValue,
        });
      } else {
        await axios.post(apiMeta, {
          id: currentYear,
          value: numericValue,
        });
      }

      setValue(String(numericValue * 100));
    } catch (err) {
      console.error('Erro ao salvar meta:', err);
    }
  };

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  // Mapeia produtos por id para preço e categoria
  const produtoInfo = useMemo(() => {
    return produtos.reduce((acc, produto) => {
      acc[produto.id] = { preco: produto.preco || 0, categoria_id: produto.categoria_id };
      return acc;
    }, {});
  }, [produtos]);

  // Calcula vendas totais no ano filtrando por categoria
  const totalVendidoAno = useMemo(() => {
    let total = 0;
    vendas.forEach(venda => {
      const dataVenda = new Date(venda.data_hora);
      if (dataVenda.getFullYear() !== currentYear) return;
      if (!Array.isArray(venda.itens)) return;

      venda.itens.forEach(({ produto_id, qtde }) => {
        const info = produtoInfo[produto_id];
        if (!info) return;
        if (categoriaSelecionada && info.categoria_id !== categoriaSelecionada) return;
        total += info.preco * qtde;
      });
    });
    return total;
  }, [vendas, produtoInfo, currentYear, categoriaSelecionada]);

  // Calcula vendas do mês atual filtrando por categoria
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth() + 1;

  const totalVendidoMes = useMemo(() => {
    let total = 0;
    vendas.forEach(venda => {
      const dataVenda = new Date(venda.data_hora);
      if (dataVenda.getFullYear() !== currentYear) return;
      if ((dataVenda.getMonth() + 1) !== mesAtual) return;
      if (!Array.isArray(venda.itens)) return;

      venda.itens.forEach(({ produto_id, qtde }) => {
        const info = produtoInfo[produto_id];
        if (!info) return;
        if (categoriaSelecionada && info.categoria_id !== categoriaSelecionada) return;
        total += info.preco * qtde;
      });
    });
    return total;
  }, [vendas, produtoInfo, currentYear, mesAtual, categoriaSelecionada]);

  const metaNumerica = Number(value) / 100 || 0;
  const percentAno = metaNumerica > 0 ? (totalVendidoAno / metaNumerica) * 100 : 0;
  const percentMes = metaNumerica > 0 ? (totalVendidoMes / metaNumerica) * 100 : 0;

  if (loadingMeta || loadingDados) return <p className="text-white">Carregando...</p>;

  return (
    <Box sx={{ width: '100%', bgcolor: '#2a2a2a', borderRadius: 2, p: 3 }}>
      {/* Input editável da meta */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mr: 2 }}>
          Meta {currentYear}:
        </Typography>
        <input
          ref={inputRef}
          type="text"
          value={formatCurrency(value || '0')}
          readOnly={!isEditMode}
          onClick={turnOnEditMode}
          onChange={handleChange}
          style={{
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            width: 220,
            fontSize: 22,
            fontWeight: 'bold',
            cursor: isEditMode ? 'text' : 'pointer',
          }}
        />
        {isEditMode && (
          <Button
            variant="contained"
            size="small"
            onClick={turnOffEditMode}
            sx={{ ml: 2 }}
          >
            Salvar
          </Button>
        )}
      </Box>

      <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
        Total vendido no ano: R$ {totalVendidoAno.toFixed(2)} ({percentAno.toFixed(1)}%)
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <LinearProgress variant="determinate" value={percentAno} />
      </Stack>

      {/* Progresso do mês atual - só texto */}
      <Typography variant="subtitle2" sx={{ color: 'white' }}>
        Venda do mês atual: R$ {totalVendidoMes.toFixed(2)}
      </Typography>
    </Box>
  );
}
