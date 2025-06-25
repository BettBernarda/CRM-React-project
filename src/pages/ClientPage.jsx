import {Box,Button,Card,CardContent,CardHeader,TextField} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessageError, showMessageSuccess } from "../utils/notification-utils";
import { v4 as uuidv4 } from 'uuid';
import RequireLogin from "../components/RequireLogin";

export default function ClientPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [cliente, setCliente] = useState({
        id: id !== 'novo' ? id : uuidv4(),
        nome: '',
        email: '',
        senha: '',
    });

    useEffect(() => {
        if (id !== 'novo') {
            axios.get(`/clientes/${id}`).then(result => setCliente(result.data));
        }
    }, [id]);

    const validateForm = () => {
        if (!cliente.nome || cliente.nome.length < 3) {
            showMessageError('Nome deve ter pelo menos 3 caracteres.');
            return false;
        }
        if (!cliente.email || !cliente.email.includes('@')) {
            showMessageError('Informe um e-mail válido.');
            return false;
        }
        if (!cliente.senha || cliente.senha.length < 4) {
            showMessageError('Senha deve ter pelo menos 4 caracteres.');
            return false;
        }
        return true;
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const now = new Date();

        if (id !== 'novo') {
            axios.patch(`/clientes/${id}`, { ...cliente, updated_at: now })
                .then(() => {
                    showMessageSuccess('Cliente salvo com sucesso!');
                    navigate(`/clientes/${id}`);
                })
                .catch((err) => {
                    showMessageError('Erro ao salvar cliente.');
                    console.log(err);
                });
        } else {
            axios.post(`/clientes`, { ...cliente, created_at: now, updated_at: now })
                .then(response => {
                    showMessageSuccess('Cliente criado com sucesso!');
                    navigate(`/clientes/${response.data.id}`);
                })
                .catch(() => showMessageError('Erro ao criar cliente.'));
        }
    };

    const handleNew = () => {
        navigate('/clientes/novo');
        setCliente({
            id: uuidv4(),
            nome: '',
            email: '',
            senha: '',
        });
    };

    const handleDelete = () => {
        if (id === 'novo') {
            showMessageError('Cliente ainda não foi salvo.');
            return;
        }

        axios.delete(`/clientes/${id}`)
            .then(() => {
                showMessageSuccess('Cliente excluído com sucesso!');
                navigate('/clientes/novo');
            })
            .catch(() => showMessageError('Erro ao excluir cliente.'));
    };

    return (
        <>
            <RequireLogin />
            <Box className="flex justify-center mt-10">
                <Card sx={{ width: '50vw', minWidth: '300px' }}>
                    <CardHeader title={id === 'novo' ? "Novo Cliente" : "Editar Cliente"} />
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
                                value={cliente.nome}
                                required
                                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={cliente.email}
                                required
                                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Senha"
                                type="password"
                                variant="outlined"
                                value={cliente.senha}
                                required
                                onChange={(e) => setCliente({ ...cliente, senha: e.target.value })}
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    Salvar
                                </Button>
                                <Button variant="outlined" color="primary" onClick={handleNew} fullWidth>
                                    Novo Cliente
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button variant="outlined" color="error" onClick={handleDelete} fullWidth>
                                    Excluir
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}
