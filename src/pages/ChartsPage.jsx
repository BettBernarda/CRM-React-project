
import ChartLine from '../components/Dashboard/ChartsLine';
import RequireLogin from '../components/Dashboard/RequireLogin';
import EditableInput from '../components/Dashboard/EditableInput';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import axios from 'axios';



// function LinearProgressWithLabel(props) {
//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ width: '100%', mr: 1 }}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box sx={{ minWidth: 35 }}>
//         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//           {`${Math.round(props.value)}%`}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }





export default function Chartspage() {
  const currentYear = new Date().getFullYear();
  const metaValue = axios.get('http://localhost:3000/Metas', { params: { id: currentYear } })
  

  return (

    <div id="Container">
      <RequireLogin />

      <div id="lineOne" className='flex flex-row'>
        <ChartLine className="basis-64" />
        <div id="Side numbers" className="basis-120 flex-col">
          <EditableInput />
          <div className="flex items-center justify-center rounded-lg bg-gray-500 mb-5 p-10">
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <LinearProgress variant="determinate" value='30.2'/>
              {/* {LinearProgressWithLabel()} */}
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