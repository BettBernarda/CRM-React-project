import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';



export const formatCurrency = (val) => {
        const num = Number(val.replace(/\D/g, '')) / 100;
        return num.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    
export default function EditableInput() {
    const currentYear = new Date().getFullYear();
    const [isEditMode, setIsEditMode] = useState(false);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);
    const api = 'http://localhost:3000/Metas';


    const parseCurrency = (formatted) => {
        return formatted.replace(/\D/g, '');
    };

    useEffect(() => {
        axios.get(api, { params: { id: currentYear } })
            .then(res => {
                if (res.data.length > 0) {
                    const meta = res.data[0];
                    setValue(String(meta.value * 100));
                } else {
                    setValue('');
                }
            })
            .catch(err => console.error('Erro ao buscar a meta:', err))
            .finally(() => setLoading(false));
    }, [currentYear]);

    const handleChange = (e) => {
        const onlyNumbers = parseCurrency(e.target.value);
        setValue(onlyNumbers);
    };

    const turnOnEditMode = () => {
        setIsEditMode(true);
    };

    const turnOffEditMode = async () => {
        setIsEditMode(false);
        const numericValue = Number(value) / 100;

        try {
            const res = await axios.get(api, { params: { id: currentYear } });

            if (res.data.length > 0) {
                const metaExistente = res.data[0];
                // metaExistente.id é 2025 (number)
                // currentYear é 2025 (number)

                // Ambos usarão 2025 (número) na URL, o que é o esperado pelo json-server para este db.json
                await axios.put(`${api}/${metaExistente.id}`, { // OU ${api}/${currentYear}
                    id: metaExistente.id, // OU id: currentYear
                    value: numericValue,
                });
            } else {
                await axios.post(api, {
                    id: currentYear,
                    value: numericValue,
                });
            }

            setValue(String(numericValue * 100));
        } catch (err) {
            console.error('Erro ao salvar meta:', err);
        }
    };



    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditMode]);

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="flex items-center rounded-lg bg-[#2a2a2a] mb-5 p-10 relative">
            <p className="text-xl font-bold text-white mr-2">Meta {currentYear}:</p>

            <input
                ref={inputRef}
                type="text"
                value={formatCurrency(value || '0')}
                readOnly={!isEditMode}
                onClick={turnOnEditMode}
                onChange={handleChange}
                className="text-white bg-transparent border-none outline-none w-[160px]"
            />

            {isEditMode && (
                <button
                    type="button"
                    onClick={turnOffEditMode}
                    className="absolute right-5 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded"
                >
                    Salvar
                </button>
            )}
        </div>
    );
}
