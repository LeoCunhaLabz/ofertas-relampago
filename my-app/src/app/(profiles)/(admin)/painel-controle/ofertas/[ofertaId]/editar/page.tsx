"use client"

import { UniqueEventModel } from "@/models";
import React, { useEffect, useState, useContext } from "react";
import { makeRequest } from "@/../../axios";
import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/navigation';

export default function DetalhesOferta({ 
    params 
}: {
    params: {
        ofertaId: string
    }
}) {
    const ofertaId = params.ofertaId;
    const { user } = useContext(UserContext);
    interface Category {
        id: number;
        name: string;
    }
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [anunciante, setAnunciante] = useState<UniqueEventModel|undefined>(undefined);
    const latitude = user?.latitude;
    const longitude = user?.longitude;
    const emailAdm = user?.email;
    const idAnunciante = user?.id;


    const [formData, setFormData] = useState({
        preco_original: '',
        preco_oferta: '',
        categoria_produto: '',
        marca_produto: '',
        descricao_oferta: ''
    });
    const [event, setEvent] = useState<UniqueEventModel[]|undefined>(undefined);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const formatCurrency = (value: string) => {
        const cleanValue = value.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos
        const floatValue = parseFloat(cleanValue) / 100;
        return floatValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const convertToDatabaseFormat = (value: string) => {
        return value.replace(',', '.');
    };


    useEffect(() => {
        const fetchCategories = async () => {
            const response = await makeRequest.get('category/see');
            setCategories(response.data);
        };
      
        fetchCategories();
    }, []);

    useEffect(() => {
        if (idAnunciante) {
            makeRequest.post("post/getoneoferta", { oferta_id: ofertaId, latitude: latitude, longitude: longitude, email: emailAdm }).then((res) => {
                setEvent(res.data.data);
                setFormData({
                    preco_original: res.data.data[0].preco_original || '',
                    preco_oferta: res.data.data[0].preco_oferta || '',
                    categoria_produto: res.data.data[0].categoria_produto || '',
                    marca_produto: res.data.data[0].marca_produto || '',
                    descricao_oferta: res.data.data[0].descricao_oferta || ''
                });
                setAnunciante(res.data.data[0]);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [ofertaId, latitude, longitude, emailAdm, idAnunciante]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === "preco_original" || name === "preco_oferta") {
            const formattedValue = formatCurrency(value);
            setFormData((prevState) => ({
                ...prevState,
                [name]: formattedValue,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            const response = await makeRequest.post('/auth/updateoferta', {
                ...formData,
                preco_original: convertToDatabaseFormat(String(formData.preco_original)),
                preco_oferta: convertToDatabaseFormat(String(formData.preco_oferta)),
                id_anuncio: ofertaId,
                email_adm: user?.email, // Certifique-se de que o email do administrador está sendo enviado
            });
            const updatedUser = response.data.data[0];
            setEvent(updatedUser);
            setSuccess('Informações atualizadas com sucesso! Redirecionando em 5 segundos.');

            // Redirecionar após 5 segundos
            setTimeout(() => {
                router.push(`/painel-controle/ofertas/${ofertaId}/`); // Substitua '/' pela rota desejada
            }, 5000);
        } catch (err) {
            console.log(err);
            setError('Erro ao atualizar as informações.');
        }
    };

    return ( 
        <main className="mt-10">
            {event ? (
                <div>
                    <div>
                        <h1 className="text-3xl font-semibold mt-10 mb-6">Anunciante</h1>
                        <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                            <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                                <div className="md:w-full md:pl-6 mt-4 md:mt-0 flex flex-col">
                                    <h1 className="text-3xl font-semibold mt-0 uppercase">{anunciante?.nome_comercial}</h1>
                                    <div className='mb-8'>
                                        <p className="text-sm">CPNJ: {anunciante?.cnpj}</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-normal mb-2">Endereço: {anunciante?.endereco_loja}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold mt-10 mb-6">Oferta</h1>
                        <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                            <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                                <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] md:h-[400px] bg-white rounded-2xl'>
                                    <img src={anunciante?.imagem_url} alt="Imagem da Oferta" className="rounded-2xl bg-white object-contain max-w-full max-h-full" />
                                </div>
                                <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col gap-y-6">
                                    <h1 className="text-3xl font-semibold mt-3">{anunciante?.nome_produto}</h1>
                                    <div>
                                        {anunciante?.ativo === 1 ? (
                                            <p className="text-sm">
                                                Até {new Date(anunciante?.data_fim_oferta).toLocaleString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        ) : (
                                            <p className="text-xl font-semibold text-red-500">Esgotado</p>
                                        )}
                                    </div>
                                    <div className="space-x-4 w-full flex items-center">
                                        <div className="mt-2 flex flex-col w-1/2 space-y-4">
                                            <p className="text-xl font-normal text-black">Preço Original (R$)</p>
                                            <input
                                                type="float"
                                                name="preco_original"
                                                value={formData.preco_original}
                                                onChange={handleChange}
                                                className="block p-2 border border-gray-300 rounded"
                                                placeholder="0,00"
                                            />
                                        </div>
                                        <div className="mt-2 flex flex-col w-1/2 items-center space-y-4">
                                            <p className="text-xl font-normal text-black">Preço com Desconto (R$)</p>
                                            <input
                                                type="float"
                                                name="preco_oferta"
                                                value={formData.preco_oferta}
                                                onChange={handleChange}
                                                className="block p-2 border border-gray-300 rounded"
                                                placeholder="0,00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-x-4 w-full flex items-center">
                                        <div className="mt-2 flex flex-col w-1/2 space-y-4">
                                            <p className="text-xl font-normal text-black">Categoria</p>
                                            <select
                                                name="categoria_produto"
                                                value={formData?.categoria_produto || ""}
                                                onChange={handleSelectChange}
                                                className="block p-2 border border-gray-300 rounded mr-1"
                                            >
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    
                                        <div className="mt-2 flex flex-col w-1/2 space-y-4">
                                            <p className="text-xl font-normal text-black">Marca do Produto</p>
                                            <input
                                                type="text"
                                                name="marca_produto"
                                                value={formData.marca_produto}
                                                onChange={handleChange}
                                                className="block p-2 border border-gray-300 rounded ml-2 mr-3"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-col items-center space-x-2">
                                        <p className="text-xl font-normal text-black">Descrição da Oferta</p>
                                        <input
                                            type="text"
                                            name="descricao_oferta"
                                            value={formData.descricao_oferta}
                                            onChange={handleChange}
                                            className="block p-2 border w-full border-gray-300 rounded"
                                        />
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
                </div>
            ) : (
                <p></p>
            )}
        </main>
    );
}