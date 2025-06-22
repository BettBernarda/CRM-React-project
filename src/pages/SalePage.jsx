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

  const listToOptions = (list) => list.reduce((options, item) => [ ...options, { label: item.nome, id: item.id }], [])

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

  const handleSelectProduct = (saleItem, value) => {
    const newSaleItemsList = saleItemsList.slice()

    newSaleItemsList.map(item => {
      if (item == saleItem) {
        item.produto_id = value
      }

      return item
    })
  }

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
              <Autocomplete
                fullWidth
                disablePortal
                options={listToOptions(customersList)}
                renderInput={(params) => <TextField {...params} fullWidth label="Cliente"/>}
                onChange={(e, value) => setSale({ ...sale, cliente_id: value.id })}
              />
              
              {saleItemsList.map(item => (
                <Card variant="outlined" className="p-2 flex flex-row gap-2" key={item.id}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    options={listToOptions(productsList)}
                    renderInput={(params) => <TextField {...params} fullWidth label="Produto"/>}
                    onChange={(product) => handleSelectProduct(item, product)}
                  />

                  <TextField
                    label="Quantidade"
                    variant="outlined"
                    type="number"
                    value={item.qtde}
                    required
                  />

                  <Button variant="outlined" color="error" sx={{ minWidth: '120px', width: '10vw', marginLeft: '5%' }} onClick={() => setSaleItemsList(saleItemsList.filter(e => e != item))}>
                    <Remove />Remover
                  </Button>
                </Card>
              ))}

              <Button variant="outlined" color="primary" onClick={() => setSaleItemsList([ ...saleItemsList, { id: uuidv4() }])}>
                <AddIcon />Adicionar item
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Salvar
                </Button>
                <Button variant="outlined" color="primary" type="button" onClick={handleNew} fullWidth>
                  Nova venda
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