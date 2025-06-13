import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function DataTable({ items, labels = [], fields = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {labels.map((label, id) => {
              if (id == 0) {
                return <TableCell key={id}>{label}</TableCell>
              }

              return <TableCell key={id} align="right">{label}</TableCell>
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {fields.map((field, id) => {
                if (id == 0) {
                  return <TableCell key={row.id + '.' + id} component="th" scope="row">{row[field].toString()}</TableCell>
                }

                return <TableCell key={row.id + '.' + id} align="right">{row[field].toString()}</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}