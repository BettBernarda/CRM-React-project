import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessageError, showMessageSuccess } from "../utils/notification-utils";
import { v4 as uuidv4 } from 'uuid'
import RequireLogin from "../components/RequireLogin";
import { Add as AddIcon, Remove } from "@mui/icons-material";

export default function SalePage() {
  const navigate = useNavigate()

  const [customersList, setCustomersList] = useState([])
  const [productsList, setProductsList] = useState([])
  const [saleItemsList, setSaleItemsList] = useState([])

  let { id } = useParams()
  const [sale, setSale] = useState({
    id: id != 'novo' ? id : uuidv4(),
    cliente_id: null,
    data_hora: new Date()
  })

  useEffect(() => {
    if (id != 'novo') {
      axios.get(`/vendas/${id}`).then(result => setSale(result.data))
      axios.get(`/venda_itens?venda_id=${id}`).then(result => setSaleItemsList(result.data))
    }

    axios.get('/clientes').then(result => setCustomersList(result.data))
    axios.get('/produtos').then(result => setProductsList(result.data))
  }, [id])

  const handleSave = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }


    const now = new Date()

    if (id != 'novo') {
      axios.patch(`/produtos/${id}`, { ...sale, updated_at: now })
        .then(() => {
          showMessageSuccess('Produto salvo com sucesso!');
          navigate(`/produtos/${id}`)
        })
        .catch((err) => {
          showMessageError('Ocorreu um erro ao salvar o produto')
          console.log(err)
        })
    } else {
      axios.post(`/produtos`, { ...sale, created_at: now, updated_at: now })
        .then(response => {
          showMessageSuccess('Produto salvo com sucesso!');
          navigate(`/produtos/${response.data.id}`)
        })
        .catch(() => showMessageError('Ocorreu um erro ao salvar o produto'))
    }
  }

  const handleNew = () => {
    navigate('/produtos/novo')
    setSale({
      id: sale.id,
      nome: '',
      status: true,
      descricao: '',
      preco: 0,
      categoria_id: null,
      fornecedor_id: null
    })
  }

  const handleDelete = () => {
    if (id == 'novo') {
      setSale({
        id: sale.id,
        nome: '',
        status: true,
        descricao: '',
        preco: 0,
        categoria_id: null,
        fornecedor_id: null
      })

      showMessageSuccess('Produto excluído com sucesso!')
      return
    }

    axios.delete(`/produtos/${id}`)
      .then(() => {
        showMessageSuccess('Produto excluído com sucesso!')
        navigate('/produtos/novo')
      })
      .catch(() => {
        showMessageError('Ocorreu um erro ao excluir o produto')
      })
  }

  const validateForm = () => {
    return true
  }

  const handleSelectItem = () => {}

  return (
    <>
      <RequireLogin />
      <Box className="flex justify-center mt-10">
        <Card sx={{ width: '50vw', minWidth: '300px' }}>
          <CardHeader title={id === 'novo' ? "Nova Venda" : "Editar Venda"} />
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSave}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Nome"
                variant="outlined"
                value={sale.nome}
                required
                onChange={(e) => setSale({ ...sale, nome: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descrição"
                variant="outlined"
                value={sale.descricao}
                required
                onChange={(e) => setSale({ ...sale, descricao: e.target.value })}
                fullWidth
              />
              <TextField
                label="Preço"
                variant="outlined"
                type="number"
                value={sale.preco}
                required
                onChange={(e) => setSale({ ...sale, preco: parseFloat(e.target.value) })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="fornecedor-label">Fornecedor</InputLabel>
                <Select
                  labelId="fornecedor-label"
                  value={sale.fornecedor_id}
                  label="Fornecedor"
                  onChange={(e) => setSale({ ...sale, fornecedor_id: e.target.value })}
                >
                  {customersList.map(fornecedor => (
                    <MenuItem value={fornecedor.id} key={fornecedor.id}>
                      {fornecedor.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="categoria-label">Categoria</InputLabel>
                <Select
                  labelId="categoria-label"
                  value={sale.categoria_id}
                  label="Categoria"
                  onChange={(e) => setSale({ ...sale, categoria_id: e.target.value })}
                >
                  {productsList.map(categoria => (
                    <MenuItem value={categoria.id} key={categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {saleItemsList.map(item => (
                <Card variant="outlined" className="p-2 flex flex-row gap-2">
                  <FormControl fullWidth>
                    <InputLabel id="categoria-label">Produto</InputLabel>
                    <Select
                      labelId="categoria-label"
                      value={item.produto_id}
                      label="Categoria"
                      onChange={handleSelectItem}
                    >
                      {productsList.map(categoria => (
                        <MenuItem value={categoria.id} key={categoria.id}>
                          {categoria.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Preço"
                    variant="outlined"
                    type="number"
                    value={sale.preco}
                    required
                    onChange={(e) => setSale({ ...sale, preco: parseFloat(e.target.value) })}
                    fullWidth
                  />

                  <Button variant="outlined" color="error" sx={{ minWidth: '120px', width: '10vw', marginLeft: '5%' }} onClick={() => setSaleItemsList(saleItemsList.filter(e => e != item))}>
                    <Remove />Remover
                  </Button>
                </Card>
              ))}

              <Button variant="outlined" color="primary" onClick={() => setSaleItemsList([ ...saleItemsList, {}])}>
                <AddIcon />Adicionar item
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Salvar
                </Button>
                <Button variant="outlined" color="primary" type="button" onClick={handleNew} fullWidth>
                  Novo Produto
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" color="error" type="button" onClick={handleDelete} fullWidth>
                  Excluir
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}