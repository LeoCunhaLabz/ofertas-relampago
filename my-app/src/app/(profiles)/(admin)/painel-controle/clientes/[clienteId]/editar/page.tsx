"use client"

import { ClientModel, EventModel } from "@/models";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importe o locale que você deseja usar
import React, { useEffect, useState } from "react";
import { makeRequest } from "@/../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { EventCard } from "@/components/EventCard";
import { useRouter } from 'next/navigation';

export default function DetalhesOferta({ 
    params 
}: {
    params: {
        clienteId: string
    }
}) {

    const [event, setEvent] = useState<EventModel[]|undefined>(undefined);
    const [anunciante, setAnunciante] = useState<ClientModel|undefined>(undefined);
    const anuncianteId = params.clienteId;
    const { user, setUser } = useContext(UserContext);
    const [userType, setUserType] = useState("");
    const [formData, setFormData] = useState({
        imagemUrl: '',
        email: '',
        cpf: '',
        nome_completo: '',
        nascimento: '',
        genero: '',
        celular: '',
        endereco: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userTypeFromLocalStorage = localStorage.getItem("ofertas-relampago:userType");
        if (userTypeFromLocalStorage && anuncianteId && user?.email) {
            setUserType(userTypeFromLocalStorage);
            makeRequest.post("post/getonecliente", { email: user?.email, id: anuncianteId }).then((res) => {
                const data = res.data.data[0];
                setAnunciante(data);
                setFormData({
                    imagemUrl: data.imagem_url || '',
                    email: data.email || '',
                    cpf: data.cpf || '',
                    nome_completo: data.nome_completo || '',
                    nascimento: data.nascimento || '',
                    genero: data.genero || '',
                    celular: data.celular || '',
                    endereco: data.endereco || ''
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [user, anuncianteId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');
        try {
            const formattedNascimento = formData.nascimento ? new Date(formData.nascimento).toISOString().split('T')[0] : '';

            const response = await makeRequest.post('/auth/updateinformationadm', {
                ...formData,
                nascimento: formattedNascimento,
                email_adm: user?.email, // Certifique-se de que o email do administrador está sendo enviado
                user_type: 'cliente'
            });
            const updatedUser = response.data.data[0];
            setAnunciante(updatedUser);
            setSuccess('Informações atualizadas com sucesso! Redirecionando em 5 segundos.');

            // Redirecionar após 5 segundos
            setTimeout(() => {
                router.push(`/painel-controle/clientes/${anuncianteId}/`); // Substitua '/' pela rota desejada
            }, 5000);
        } catch (err) {
            console.log(err);
            setError('Erro ao atualizar as informações.');
        }
    };

    return (    
        <main className="flex-col flex justify-center align-middle max-h-full">
            <div>
                <h1 className="text-3xl font-semibold mt-10 mb-6">Cliente</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] rounded-2xl'>
                        <img src={'/genericperson.png'} alt="Imagem do Anunciante" className="mx-auto md:w-1/2 rounded-2xl h-36 object-scale-down mb-2" />
                        </div>
                        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
                            <h1 className="text-3xl font-semibold mt-0 uppercase">{formData.nome_completo}</h1>
                            <div className='mb-8'>
                                <p className="text-sm">Data de cadastro: {anunciante?.data_cadastro ? format(new Date(anunciante.data_cadastro), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xl font-normal mb-2">CPF:</label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Nome Completo:</label>
                                    <input
                                        type="text"
                                        name="nome_completo"
                                        value={formData.nome_completo}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Data de Nascimento:</label>
                                    <input
                                        type="date"
                                        name="nascimento"
                                        value={formData.nascimento ? new Date(formData.nascimento).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Gênero:</label>
                                    <input
                                        type="text"
                                        name="genero"
                                        value={formData.genero}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Celular:</label>
                                    <input
                                        type="text"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xl font-normal mb-2">Endereço:</label>
                                    <input
                                        type="text"
                                        name="endereco"
                                        value={formData.endereco}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            {success && <p className="text-green-500 mt-2">{success}</p>}
                            <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                                Salvar alterações
                            </button>                        
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}