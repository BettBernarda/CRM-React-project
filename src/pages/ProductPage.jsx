import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessageError, showMessageSuccess } from "../utils/notification-utils";
import { v4 as uuidv4 } from 'uuid'
import RequireLogin from "../components/RequireLogin";

export default function ProductPage() {
  const navigate = useNavigate()

  const [fornecedoresList, setFornecedoresList] = useState([])
  const [categoriasList, setCategoriasList] = useState([])

  let { id } = useParams()
  const [product, setProduct] = useState({
    id: id != 'novo' ? id : uuidv4(),
    nome: '',
    status: true,
    descricao: '',
    preco: null,
    categoria_id: null,
    fornecedor_id: null
  })

  useEffect(() => {
    if (id != 'novo') {
      axios.get(`/produtos/${id}`)
        .then(result => setProduct(result.data))
        .catch(() => navigate('/produtos/novo'))
    }

    axios.get('/fornecedores').then(result => setFornecedoresList(result.data))
    axios.get('/categorias_produto').then(result => setCategoriasList(result.data))
  }, [id])

  const handleSave = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }


    const now = new Date()

    if (id != 'novo') {
      axios.patch(`/produtos/${id}`, { ...product, updated_at: now })
        .then(() => {
          showMessageSuccess('Produto salvo com sucesso!');
          navigate(`/produtos/${id}`)
        })
        .catch((err) => {
          showMessageError('Ocorreu um erro ao salvar o produto')
          console.log(err)
        })
    } else {
      axios.post(`/produtos`, { ...product, upadted_at: now, created_at: now })
        .then(response => {
          showMessageSuccess('Produto salvo com sucesso!');
          navigate(`/produtos/${response.data.id}`)
        })
        .catch(() => showMessageError('Ocorreu um erro ao salvar o produto'))
    }
  }

  const handleNew = () => {
    navigate('/produtos/novo')
    setProduct({
      id: product.id,
      nome: '',
      status: true,
      descricao: '',
      preco: 0,
      qtde: 0,
      categoria_id: null,
      fornecedor_id: null
    })
  }

  const handleDelete = () => {
    if (id == 'novo') {
      setProduct({
        id: product.id,
        nome: '',
        status: true,
        descricao: '',
        qtde: 0,
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
    if (!product.nome) {
      showMessageError('É necessário preencher o nome do produto!')
      return false
    }

    if (product.nome.length < 3) {
      showMessageError('Nome do produto deve ter pelo menos 3 caracteres!')
      return false
    }

    if (!product.descricao) {
      showMessageError('É neecssário preencher a descrição do produto!')
      return false
    }

    if (!product.preco) {
      showMessageError('È necessário preencher o preço do produto!')
      return false
    }

    if (product.preco < 0) {
      showMessageError('Preço do produto não pode ser negativo!')
      return false
    }

    if (!product.qtde) {
      showMessageError('É necessário preencher a quantidade do produto!')
      return false
    }

    if (product.qtde < 0) {
      showMessageError('Quantidade do produto não pode ser negativa!')
      return false
    }

    if (product.preco <= 0) {
      showMessageError('Preço do produto deve ser maior que zero!')
    }

    if (!product.categoria_id) {
      showMessageError('É necessário selecionar a categoria do produto!')
      return false
    }

    if (!product.fornecedor_id) {
      showMessageError('É necessário selecionar o fornecedor do produto!')
      return false
    }

    if (product.status == null) {
      setProduct({ ...product, status: false })
    }

    return true
  }

  return (
    <>
      <RequireLogin />
      <Box className="flex justify-center mt-10">
        <Card sx={{ width: '50vw', minWidth: '300px' }}>
          <CardHeader title={id === 'novo' ? "Novo Produto" : "Editar Produto"} />
          <CardContent>
            <Box
              component="form"
              noValidate
              onSubmit={handleSave}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Nome"
                variant="outlined"
                value={product.nome}
                required
                onChange={(e) => setProduct({ ...product, nome: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descrição"
                variant="outlined"
                value={product.descricao}
                required
                onChange={(e) => setProduct({ ...product, descricao: e.target.value })}
                fullWidth
              />
              <TextField
                label="Preço"
                variant="outlined"
                type="number"
                value={product.preco}
                required
                onChange={(e) => setProduct({ ...product, preco: parseFloat(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Quantidade"
                variant="outlined"
                type="number"
                value={product.qtde}
                onChange={(e) => setProduct({ ...product, qtde: parseFloat(e.target.value)})}
                required
              />
              {/* TODO: alterar esse Select para Autocomplete se der tempo */}
              <FormControl fullWidth>
                <InputLabel id="fornecedor-label">Fornecedor</InputLabel>
                <Select
                  labelId="fornecedor-label"
                  value={product.fornecedor_id}
                  label="Fornecedor"
                  onChange={(e) => setProduct({ ...product, fornecedor_id: e.target.value })}
                >
                  {fornecedoresList.map(fornecedor => (
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
                  value={product.categoria_id}
                  label="Categoria"
                  onChange={(e) => setProduct({ ...product, categoria_id: e.target.value })}
                >
                  {categoriasList.map(categoria => (
                    <MenuItem value={categoria.id} key={categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.status}
                    onChange={(e, checked) => setProduct({ ...product, status: checked })}
                  />
                }
                label="Ativo"
              />

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