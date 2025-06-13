import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/**
 * 
 * @param labels Rótulos das colunas da tabela, na ordem especificada
 * @param fields Nomes dos campos que devem ser mostrados de cada item, na ordem especificada
 * @param items Os itens/linhas que devem ser mostrados
 */
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
                  return <TableCell key={id} component="th" scope="row">{row[field].toString()}</TableCell>
                }

                return <TableCell key={id} align="right">{row[field].toString()}</TableCell>
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}