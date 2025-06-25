import { Box, Button, Card, CardContent, CardHeader, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showMessageError, showMessageSuccess } from "../utils/notification-utils";
import { v4 as uuidv4 } from 'uuid';
import RequireLogin from "../components/RequireLogin";

export default function SupplierPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [supplier, setSupplier] = useState({
        id: id !== 'novo' ? id : uuidv4(),
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
    });

    useEffect(() => {
        if (id !== 'novo') {
            axios.get(`/fornecedores/${id}`).then(result => setSupplier(result.data));
        }
    }, [id]);

    const validateForm = () => {
        if (!supplier.nome || supplier.nome.length < 3) {
            showMessageError('Nome deve ter pelo menos 3 caracteres.');
            return false;
        }
        if (!supplier.cnpj || supplier.cnpj.length !== 14) {
            showMessageError('CNPJ deve ter 14 dígitos numéricos.');
            return false;
        }
        if (!supplier.email || !supplier.email.includes('@')) {
            showMessageError('Informe um e-mail válido.');
            return false;
        }
        return true;
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const now = new Date();

        if (id !== 'novo') {
            axios.patch(`/fornecedores/${id}`, { ...supplier, updated_at: now })
                .then(() => {
                    showMessageSuccess('Fornecedor salvo com sucesso!');
                    navigate(`/fornecedores/${id}`);
                })
                .catch((err) => {
                    showMessageError('Erro ao salvar fornecedor.');
                    console.log(err);
                });
        } else {
            axios.post(`/fornecedores`, { ...supplier, created_at: now, updated_at: now })
                .then(response => {
                    showMessageSuccess('Fornecedor criado com sucesso!');
                    navigate(`/fornecedores/${response.data.id}`);
                })
                .catch(() => showMessageError('Erro ao criar fornecedor.'));
        }
    };

    const handleNew = () => {
        navigate('/fornecedores/novo');
        setSupplier({
            id: uuidv4(),
            nome: '',
            cnpj: '',
            telefone: '',
            email: '',
            endereco: '',
        });
    };

    const handleDelete = () => {
        if (id === 'novo') {
            showMessageError('Fornecedor ainda não foi salvo.');
            return;
        }

        axios.delete(`/fornecedores/${id}`)
            .then(() => {
                showMessageSuccess('Fornecedor excluído com sucesso!');
                navigate('/fornecedores/novo');
            })
            .catch(() => showMessageError('Erro ao excluir fornecedor.'));
    };

    return (
        <>
            <RequireLogin />
            <Box className="flex justify-center mt-10">
                <Card sx={{ width: '50vw', minWidth: '300px' }}>
                    <CardHeader title={id === 'novo' ? "Novo Fornecedor" : "Editar Fornecedor"} />
                    <CardContent>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSave}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <TextField label="Nome" variant="outlined" required fullWidth value={supplier.nome} onChange={(e) => setSupplier({ ...supplier, nome: e.target.value })} />
                            <TextField label="CNPJ" variant="outlined" required fullWidth value={supplier.cnpj} onChange={(e) => setSupplier({ ...supplier, cnpj: e.target.value })} />
                            <TextField label="Telefone" variant="outlined" fullWidth value={supplier.telefone} onChange={(e) => setSupplier({ ...supplier, telefone: e.target.value })} />
                            <TextField label="Email" variant="outlined" required fullWidth value={supplier.email} onChange={(e) => setSupplier({ ...supplier, email: e.target.value })} />
                            <TextField label="Endereço" variant="outlined" fullWidth value={supplier.endereco} onChange={(e) => setSupplier({ ...supplier, endereco: e.target.value })} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button variant="contained" color="primary" type="submit" fullWidth>Salvar</Button>
                                <Button variant="outlined" color="primary" onClick={handleNew} fullWidth>Novo</Button>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button variant="outlined" color="error" onClick={handleDelete} fullWidth>Excluir</Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
} 