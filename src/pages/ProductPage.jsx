import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const [fornecedoresList, setFornecedoresList] = useState([])
  const [categoriasList, setCategoriasList] = useState([])
  
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
    if (id != 'novo') {
      axios.get(`/produtos/${id}`).then(result => setProduct(result.data))
    }

    axios.get('/fornecedores').then(result => setFornecedoresList(result.data))
    axios.get('/categorias_produto').then(result => setCategoriasList(result.data))
  }, [id])

  const handleSave = (e) => {
    e.preventDefault()

    if (id != 'novo') {
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
      onSubmit={handleSave}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={5000}
        message="I love snacks"
        />
      <FormControl>
        <TextField
          label="Nome"
          variant="outlined"
          value={product.nome}
          required onChange={(e) => setProduct({ ...product, nome: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Descrição"
          variant="outlined"
          value={product.descricao}
          required onChange={(e) => setProduct({ ...product, descricao: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Preço"
          variant="outlined"
          value={product.preco}
          required onChange={(e) => setProduct({ ...product, preco: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <Select
          labelId="fornecedor-select-label"
          id="fornecedor-select"
          value={product.fornecedor_id}
          label="Fornecedor"
          onChange={(e) => setProduct({ ...product, fornecedor_id: e.target.value })}
        >
          {fornecedoresList.map(fornecedor => <MenuItem value={fornecedor.id} key={fornecedor.id}>{fornecedor.nome}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl>
        <Select
          labelId="categoria-select-label"
          id="categoria-select"
          value={product.categoria_id}
          label="Categoria"
          onChange={(e) => setProduct({ ...product, categoria_id: e.target.value })}
        >
          {categoriasList.map(categoria => <MenuItem value={categoria.id} key={categoria.id}>{categoria.nome}</MenuItem>)}
        </Select>
      </FormControl>
      <Checkbox checked={product.status} onChange={(e, val) => setProduct({ ...product, status: val })} />
      <Button variant="contained" type="submit">Salvar</Button>
    </Box>
  )
}