import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessageError, showMessageSuccess } from "../utils/notification-utils";
import { v4 as uuidv4 } from 'uuid'
import RequireLogin from "../components/RequireLogin";
import { Add as AddIcon, Remove } from "@mui/icons-material";
import { formatCurrency } from "../utils/format-utils";

// TODO: falta finalizar a implementação de interação estoque-venda
// - verificação se quantidade vendida extrapola a quantidade disponível do produto
// - "ressarcimento" dos itens após a exclusão da venda
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

  const findProductById = async (id) => {
    return (await axios.get(`/produtos/${id}`)).data
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!await validateForm()) {
      return
    }

    const now = new Date()

    
    if (id != 'novo') {
      let saleOld

      try {
         saleOld = (await axios.get(`/vendas/${id}`)).data
      } catch {
        showMessageError('Não foi possível recuperar os dados')
        return
      }

      saleOld.itens.forEach(console.log)

      const newItemsProductIds = sale.itens.map(item => item.produto_id)
      const oldItemsProductIds = saleOld.itens.map(item => item.produto_id)

      const qtdeToSubtractByProductId = new Map()

      // Set para garantir unicidade
      const allItemProductsOldAndNew = new Set()

      sale.itens.forEach((item) => allItemProductsOldAndNew.add(item.produto_id))
      saleOld.itens.forEach((item) => allItemProductsOldAndNew.add(item.produto_id))

      allItemProductsOldAndNew.forEach(async produtoId => {
        if (newItemsProductIds.includes(produtoId) || oldItemsProductIds.includes(produtoId)) {
          const product = await findProductById(produtoId)
          const oldItem = saleOld.itens.find(item => item.produto_id == produtoId)
          const newItem = sale.itens.find(item => item.produto_id == produtoId)

          if (newItem && oldItem) {
            const qtdeDiff = newItem.qtde - oldItem.qtde
            if (qtdeDiff == 0) {
              return 
            }

            qtdeToSubtractByProductId.set(produtoId, product.qtde - qtdeDiff)
            
          } else if (newItem) {
            qtdeToSubtractByProductId.set(produtoId, product.qtde - newItem.qtde)

          } else if (oldItem) {
            qtdeToSubtractByProductId.set(produtoId, product.qtde + oldItem.qtde) // "devolve" a quantidade dos produtos
          }
        }
      })

      axios.patch(`/vendas/${id}`, { ...sale, updated_at: now })
        .then(() => {
          qtdeToSubtractByProductId.forEach((qtde, productId) => {
            alert(productId + ' - ' + qtde)
            axios.patch(`/produtos/${productId}`, { qtde })
          })

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
          sale.itens.forEach(updateProductQtde)

          showMessageSuccess('Venda salva com sucesso!');
          navigate(`/vendas/${response.data.id}`)
        })
        .catch(() => showMessageError('Ocorreu um erro ao salvar a venda'))
    }
  }

  const updateProductQtde = async item => {
    const product = (await axios.get(`/produtos/${item.produto_id}`)).data

    product.qtde -= item.qtde
    axios.patch(`/produtos/${item.produto_id}`, product)
  }

  const handleNew = () => {
    navigate('/produtos/novo')
    setSale({
      id: uuidv4(),
      cliente_id: null,
      data_hora: new Date(),
      itens: []
    })
  }

  const handleDelete = () => {
    if (id == 'novo') {
      setSale({
        id: uuidv4(),
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
      if (!item.qtde || item.qtde < 0) {
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

  const filterNotSelectedProducts = () => productsList.filter(product => !sale.itens.map(item => item.produto_id).includes(product.id))

  useEffect(() => {
    console.log(sale)
  }, [sale])

  const getFormattedTotal = () => {
    const saleItemsWithQtde = sale.itens
      .map(item => {
        return { product: productsList.find(product => product.id == item.produto_id), qtde: item.qtde ?? 0 }
      })
      .filter(item => item.product)

    const saleTotal = saleItemsWithQtde.reduce((total, item) => total + (item.product.preco * item.qtde), 0)
    return formatCurrency(saleTotal)
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
        const qtdeInt = parseInt(qtde)
        item.qtde = isNaN(qtdeInt) ? 0 : qtdeInt
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
              noValidate
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
              
              {sale.itens.map((item, i) => (
                <Card variant="outlined" className="p-2 flex flex-row gap-2" key={i}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    value={productsList.find(p => p.id == item.produto_id) ?? null}
                    options={filterNotSelectedProducts()}
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
              
              <Typography>Total: {getFormattedTotal()}</Typography>

              <Button variant="outlined" color="primary" onClick={() => setSale({...sale, itens: [ ...sale.itens, {}] })}>
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