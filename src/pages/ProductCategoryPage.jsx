import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessageError, showMessageSuccess } from "../utils/notification-utils";
import { v4 as uuidv4 } from 'uuid'
import RequireLogin from "../components/RequireLogin";

export default function ProductCategoryPage() {
  const navigate = useNavigate()

  let { id } = useParams()
  const [category, setCategory] = useState({
    id: id != 'novo' ? id : uuidv4(),
    nome: '',
    descricao: '',
  })

  useEffect(() => {
    if (id != 'novo') {
      axios.get(`/categorias_produto/${id}`).then(result => setCategory(result.data))
    }
  }, [id])

  const handleSave = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }


    const now = new Date()

    if (id != 'novo') {
      axios.patch(`/categorias_produto/${id}`, { ...category, updated_at: now })
        .then(() => {
          showMessageSuccess('Categoria salva com sucesso!');
          navigate(`/produtos/categorias/${id}`)
        })
        .catch((err) => {
          showMessageError('Ocorreu um erro ao salvar a categoria')
          console.log(err)
        })
    } else {
      axios.post(`/categorias_produto`, { ...category, created_at: now, updated_at: now })
        .then(response => {
          showMessageSuccess('Categoria salva com sucesso!');
          navigate(`/produtos/categorias/${response.data.id}`)
        })
        .catch(() => showMessageError('Ocorreu um erro ao salvar a categoria'))
    }
  }

  const handleNew = () => {
    navigate('/produtos/categorias/novo')
    setCategory({
      id: category.id,
      nome: '',
      descricao: '',
    })
  }

  const handleDelete = async () => {
    if (id == 'novo') {
      setCategory({
        id: category.id,
        nome: '',
        descricao: '',
      })

      showMessageSuccess('Categoria excluída com sucesso!')
      return
    }

    const produtosComEssaCategoria = (await axios.get(`/produtos?categoria_id=${id}`)).data

    if (produtosComEssaCategoria.length) {
      showMessageError('Não é possível excluir esta categoria pois já existem produtos cadastrados com ela')
      return
    }

    axios.delete(`/produtos/${id}`)
      .then(() => {
        showMessageSuccess('Categoria excluída com sucesso!')
        navigate('/produtos/novo')
      })
      .catch(() => {
        showMessageError('Ocorreu um erro ao excluir a categoria')
      })
  }

  const validateForm = () => {
    if (!category.nome) {
      showMessageError('É necessário preencher o nome da categoria!')
      return false
    }

    if (category.nome.length < 3) {
      showMessageError('Nome da categoria deve ter pelo menos 3 caracteres!')
      return false
    }

    if (!category.descricao) {
      showMessageError('É neecssário preencher a descrição da categoria!')
      return false
    }

    return true
  }

  return (
    <>
      <RequireLogin />
      <Box className="flex justify-center mt-10">
        <Card sx={{ width: '50vw', minWidth: '300px' }}>
          <CardHeader title={id === 'novo' ? "Nova Categoria" : "Editar Categoria"} />
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
                value={category.nome}
                required
                onChange={(e) => setCategory({ ...category, nome: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descrição"
                variant="outlined"
                value={category.descricao}
                required
                onChange={(e) => setCategory({ ...category, descricao: e.target.value })}
                fullWidth
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Salvar
                </Button>
                <Button variant="outlined" color="primary" type="button" onClick={handleNew} fullWidth>
                  Nova Categoria
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