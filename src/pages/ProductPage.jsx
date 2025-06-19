import { Box, Button, Checkbox, FormControl, FormControlLabel, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState({
    id,
    nome: '',
    status: true,
    descricao: '',
    preco: 0.00,
    categoria_id: 0,
    fornecedor_id: 0
  })

  useEffect(() => {
    axios.get(`/produtos/${id}`).then(result => setProduct(result.data))
  }, [id])

  const handleSave = (e) => {
    e.preventDefault()

    if (product.id) {
      axios.patch(`/produtos/${id}`, product)
    } else {
      axios.post(`/produtos`, product)
    }
  }

  return (
     <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={5000}
        message="I love snacks"
      />
      <FormControl>
        <TextField id="outlined-basic" label="Nome" variant="outlined" value={product.nome} required onChange={(e) => setProduct({ ...product, nome: e.target.value })} />
      </FormControl>
      <FormControl>
        <TextField id="outlined-basic" label="Descrição" variant="outlined" value={product.descricao} required onChange={(e) => setProduct({ ...product, descricao: e.target.value })} />
      </FormControl>
      <FormControl>
        <TextField id="outlined-basic" label="Preço" variant="outlined" value={product.preco} required onChange={(e) => setProduct({ ...product, preco: e.target.value })} />
      </FormControl>
      <FormControl>
        <Checkbox checked={product.status} onChange={(e, val) => setProduct({ ...product, status: val })} />
      </FormControl>
      <Button variant="contained" type="button" onClick={handleSave}>Salvar</Button>
    </Box>
  )
}