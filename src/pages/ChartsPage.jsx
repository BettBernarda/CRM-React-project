import { Grid, Box, Stack, LinearProgress } from '@mui/material';
import ChartLine from '../components/Dashboard/ChartsLine';
import RequireLogin from '../components/Dashboard/RequireLogin';
import EditableInput from '../components/Dashboard/GoalProgression';
import axios from 'axios';
import { useState, useEffect } from 'react';
import TabelaTopVendas from '../components/Dashboard/TopSelling';
import GraficoCategoriasFiltravel from '../components/Dashboard/PizzaChart';
import MetaProgressao from '../components/Dashboard/GoalProgression';

export default function Chartspage() {
  const currentYear = new Date().getFullYear();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [metaValue, setMetaValue] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3000/Metas?id=${currentYear}`)
      .then((res) => {
        if (res.data.length > 0) {
          setMetaValue(res.data[0].value);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar meta:', err);
      });
  }, [currentYear]);

  return (
    <div id="Container" className="p-4">
      <RequireLogin />

      <div id="lineOne" className="flex flex-row gap-4 mb-10">
        <ChartLine categoriaSelecionada={categoriaSelecionada} />
        <div id="Side-numbers" className="basis-1/3 flex flex-col gap-4">
          <MetaProgressao />
        </div>
      </div>

      {categoriaSelecionada && (
        <button
          onClick={() => setCategoriaSelecionada(null)}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Limpar filtro
        </button>
      )}

      <div id="lineTwo" className="flex flex-col md:flex-row mt-4 gap-4">
        <div id="table" className="flex-1 basis-128">
          <TabelaTopVendas categoriaSelecionada={categoriaSelecionada} />
        </div>
        <div id="GraphBox" className="flex-1 flex flex-col md:flex-row gap-4">
          <div id="graph" className="flex-1" >
            <GraficoCategoriasFiltravel onCategoriaSelecionada={setCategoriaSelecionada} />
          </div>
        </div>
      </div>
    </div>
  );
}
