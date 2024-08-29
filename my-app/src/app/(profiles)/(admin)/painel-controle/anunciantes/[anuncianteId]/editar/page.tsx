"use client"

import { AnuncianteModel, ClientModel, EventModel } from "@/models";
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
        anuncianteId: string
    }
}) {

    const [event, setEvent] = useState<EventModel[]|undefined>(undefined);
    const [anunciante, setAnunciante] = useState<AnuncianteModel|undefined>(undefined);
    const anuncianteId = params.anuncianteId;
    const { user, setUser } = useContext(UserContext);
    const [userType, setUserType] = useState("");
    const [formData, setFormData] = useState({
        imagemUrl: '',
        email: '',
        cnpj: '',
        nome_comercial: '',
        endereco: '',
        moedas: '',
        razao_social: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userTypeFromLocalStorage = localStorage.getItem("ofertas-relampago:userType");
        if (userTypeFromLocalStorage && anuncianteId && user?.email) {
            setUserType(userTypeFromLocalStorage);
            makeRequest.post("post/getoneanunciante", { email: user?.email, id: anuncianteId }).then((res) => {
                const data = res.data.data[0];
                setAnunciante(data);
                setFormData({
                    imagemUrl: data.imagem_url || '',
                    email: data.email || '',
                    cnpj: data.cnpj || '',
                    nome_comercial: data.nome_comercial || '',
                    endereco: data.endereco || '',
                    moedas: data.moedas || 0,
                    razao_social: data.razao_social || '',
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
            const response = await makeRequest.post('/auth/updateinformationadm', {
                ...formData,
                email_adm: user?.email, // Certifique-se de que o email do administrador está sendo enviado
                user_type: 'anunciante'
            });
            const updatedUser = response.data.data[0];
            setAnunciante(updatedUser);
            setSuccess('Informações atualizadas com sucesso! Redirecionando em 5 segundos.');

            // Redirecionar após 5 segundos
            setTimeout(() => {
                router.push(`/painel-controle/anunciantes/${anuncianteId}/`); // Substitua '/' pela rota desejada
            }, 5000);
        } catch (err) {
            console.log(err);
            setError('Erro ao atualizar as informações.');
        }
    };

    return (    
        <main className="flex-col flex justify-center align-middle max-h-full">
            <div>
                <h1 className="text-3xl font-semibold mt-10 mb-6">Anunciante</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] rounded-2xl'>
                        <img src={'/genericcompany.png'} alt="Imagem do Anunciante" className="mx-auto md:w-1/2 rounded-2xl h-36 object-scale-down mb-2" />
                        </div>
                        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
                            <h1 className="text-3xl font-semibold mt-0 uppercase">{formData.razao_social}</h1>
                            <div className='mb-8'>
                                <p className="text-sm">Data de cadastro: {anunciante?.data_cadastro ? format(new Date(anunciante.data_cadastro), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xl font-normal mb-2">CNPJ:</label>
                                    <input
                                        type="text"
                                        name="cnpj"
                                        value={formData.cnpj}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Nome Comercial:</label>
                                    <input
                                        type="text"
                                        name="nome_comercial"
                                        value={formData.nome_comercial}
                                        onChange={handleChange}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-normal mb-2">Razão Social:</label>
                                    <input
                                        type="text"
                                        name="razao_social"
                                        value={formData.razao_social}
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
                                    <label className="block text-xl font-normal mb-2">Créditos:</label>
                                    <input
                                        type="text"
                                        name="moedas"
                                        value={formData.moedas}
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