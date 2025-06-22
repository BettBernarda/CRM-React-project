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

  let { id } = useParams()
  const [sale, setSale] = useState({
    id: id != 'novo' ? id : uuidv4(),
    cliente_id: null,
    data_hora: new Date(),
    itens: []
  })

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [customersResponse, productsResponse] = await Promise.all([
        axios.get('/clientes'),
        axios.get('/produtos')
      ])

      setCustomersList(customersResponse.data)
      setProductsList(productsResponse.data)

      if (id != 'novo') {
        const saleResponse = await axios.get(`/vendas/${id}`)
        setSale(saleResponse.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados', error)
      showMessageError('Erro ao carregar dados')
    }
  }

  fetchData()
}, [id])

  const findCustomerNameById = id => customersList.find(customer => customer.id == id)?.nome ?? ''

  const handleSave = async (e) => {
    e.preventDefault()

    if (!await validateForm()) {
      return
    }

    const now = new Date()

    if (id != 'novo') {
      axios.patch(`/vendas/${id}`, { ...sale, updated_at: now })
        .then(() => {
          showMessageSuccess('Venda salva com sucesso!');
          navigate(`/vendas/${id}`)
        })
        .catch((err) => {
          showMessageError('Ocorreu um erro ao salvar a venda')
          console.log(err)
        })
    } else {
      axios.post(`/vendas`, { ...sale, created_at: now, updated_at: now })
        .then(response => {
          showMessageSuccess('Venda salva com sucesso!');
          navigate(`/vendas/${response.data.id}`)
        })
        .catch(() => showMessageError('Ocorreu um erro ao salvar a venda'))
    }
  }

  const handleNew = () => {
    navigate('/produtos/novo')
    setSale({
      id: sale.id,
      cliente_id: null,
      data_hora: new Date(),
      itens: []
    })
  }

  const handleDelete = () => {
    if (id == 'novo') {
      setSale({
        id: sale.id,
        cliente_id: null,
        data_hora: new Date(),
        itens: []
      })

      showMessageSuccess('Produto excluído com sucesso!')
      return
    }

    axios.delete(`/vendas/${id}`)
      .then(() => {
        showMessageSuccess('Venda excluída com sucesso!')
        navigate('/vendas/novo')
      })
      .catch(() => {
        showMessageError('Ocorreu um erro ao excluir a venda')
      })
  }

  const validateForm = async () => {
    if (!sale.cliente_id) {
      showMessageError('É necessário selecionar um cliente!')
      return false
    }

    if (!sale.data_hora) {
      showMessageError('É necessário preencher a data da venda!')
      return false
    }

    if (!sale.data_hora > new Date()) {
      showMessageError('Data da venda não pode ser inferior a data atual!')
    }

    for (let item of sale.itens) {
      if (item.qtde < 0) {
        showMessageError('Quantidade do produto deve ser maior que zero')
        return false
      }

      let product
      
      try {
        product = (await axios.get(`/produtos/${item.produto_id}`)).data
      } catch { /* empty */ }

      if (!product) {
        showMessageError('Produto inválido selecionado!')
        return false
      }

      if (product.qtde < item.qtde) {
        showMessageError(`Quantidade indisponível para o produto ${product.nome}!`)
        return false
      }
    }

    return true
  }

  const handleSelectProduct = (saleItem, value) => {
    const itens = sale.itens.map(item => {
      if (item == saleItem) {
        item.produto_id = value?.id
      }

      return item
    })

    setSale({ ...sale, itens })
  }

  const handleSetQtdeItem = (saleItem, qtde) => {
    const itens = sale.itens.map(item => {
      if (item == saleItem) {
        item.qtde = parseInt(qtde)
      }

      return item
    })

    setSale({ ...sale, itens })
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
                value={customersList.find(c => c.id == sale.cliente_id) ?? null}
                options={customersList}
                getOptionLabel={(option) => option.nome ?? ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) => setSale({ ...sale, cliente_id: value?.id ?? null })}
                renderInput={(params) => <TextField {...params} fullWidth label="Cliente"/>}
              />
              
              {sale.itens.map(item => (
                <Card variant="outlined" className="p-2 flex flex-row gap-2" key={item.id}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    value={productsList.find(p => p.id == item.produto_id) ?? null}
                    options={productsList}
                    getOptionLabel={(option) => option.nome ?? ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField {...params} fullWidth label="Produto"/>}
                    onChange={(e, product) => handleSelectProduct(item, product)}
                  />

                  <TextField
                    label="Quantidade"
                    variant="outlined"
                    type="number"
                    value={item.qtde}
                    onChange={(e) => handleSetQtdeItem(item, e.target.value)}
                    required
                  />

                  <Button variant="outlined" color="error" sx={{ minWidth: '120px', width: '10vw', marginLeft: '5%' }} onClick={() => setSale({...sale, itens: sale.itens.filter(currItem => currItem != item) })}>
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