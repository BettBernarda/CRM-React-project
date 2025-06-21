import * as React from 'react';

import ChartLine from '../components/Charts';

export default function Chartspage() {
  return (
    <div id="Container">
      <div id="lineOne" className='flex flex-row'>
        <ChartLine className="basis-64" />
        <div id="Side numbers" className="basis-120 flex-col">
            <div className="flex items-center justify-center rounded-lg bg-[#2a2a2a] mb-5 p-10 relative">
              <p className='absolute top-50% left-5 text-xl 2 font-bold'>Meta para 2025</p>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-gray-500 mb-5 p-10"></div>
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