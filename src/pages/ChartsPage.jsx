import * as React from 'react';

import ChartLine from '../components/ChartsLine';
import RequireLogin from '../components/RequireLogin';
import EditableInput from '../components/EditableInput';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';



export default function Chartspage() {
  return (

    <div id="Container">
      <RequireLogin />

      <div id="lineOne" className='flex flex-row'>
        <ChartLine className="basis-64" />
        <div id="Side numbers" className="basis-120 flex-col">
          <EditableInput />
          <div className="flex items-center justify-center rounded-lg bg-gray-500 mb-5 p-10">
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <br />
              <LinearProgress variant="determinate" value={} />
            </Stack>
          </div>
        </div>
      </div>
      <div id="lineTwo">
        <div id="table"></div>
        <div id="GraphBox">
          <div id="graph"></div>
          <div id="graphinfo"></div>
        </div>
      </div>
    </div>
  );
}