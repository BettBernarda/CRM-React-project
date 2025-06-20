import * as React from 'react';

import ChartLine from '../components/Charts';
import RequireLogin from '../components/RequireLogin';

export default function Chartspage() {
  return (
    <>
      <RequireLogin />
      <ChartLine />
    </>
  );
}