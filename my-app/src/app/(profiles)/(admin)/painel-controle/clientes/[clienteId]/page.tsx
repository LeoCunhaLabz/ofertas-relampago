"use client"

import { ClientModel, EventModel } from "@/models";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importe o locale que você deseja usar
import React, { useEffect, useState } from "react";
import { makeRequest } from "@/../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { EventCard } from "@/components/EventCard";
import Link from "next/link"; // Importe o componente Link

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
    const { user } = useContext(UserContext);
    const [userType, setUserType] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;

    useEffect(() => {
        const userTypeFromLocalStorage = localStorage.getItem("ofertas-relampago:userType");
        if (userTypeFromLocalStorage && anuncianteId && user?.email) {
            setUserType(userTypeFromLocalStorage);
            makeRequest.post("post/getonecliente", { email: user?.email, id: anuncianteId }).then((res) => {
                setAnunciante(res.data.data[0]);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [user, anuncianteId]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = event?.slice(indexOfFirstEvent, indexOfLastEvent) ?? [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    return (    
        <main className="flex-col flex justify-center align-middle max-h-full">
            <div>
                <h1 className="text-3xl font-semibold mt-10 mb-6">Cliente</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] rounded-2xl'>
                        <img src={/*anunciante?.imagem_url && anunciante?.imagem_url.length > 0 ? anunciante?.imagem_url : */ '/genericperson.png'} alt="Imagem do Anunciante" className="mx-auto md:w-1/2 rounded-2xl h-36 object-scale-down mb-2" />
                        </div>
                        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
                            <h1 className="text-3xl font-semibold mt-0 uppercase">{anunciante?.nome_completo}</h1>
                            <div className='mb-8'>
                                <p className="text-sm">Data de cadastro: {anunciante?.data_cadastro ? format(new Date(anunciante.data_cadastro), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'}</p>
                            </div>
                            <div>
                                <p className="text-xl font-normal mb-2">CPF: {anunciante?.cpf}</p>
                                <p className="text-xl font-normal mb-2">Nome Completo: {anunciante?.nome_completo}</p>
                                <p className="text-xl font-normal mb-2">Data de Nascimento: {anunciante?.nascimento ? new Date(anunciante.nascimento).toLocaleDateString('pt-BR') : ''}</p>
                                <p className="text-xl font-normal mb-2">Gênero: {anunciante?.genero}</p>
                                <p className="text-xl font-normal mb-2">Celular: {anunciante?.celular}</p>
                                <p className="text-xl font-normal mb-2">Email: {anunciante?.email}</p>
                                <p className="text-xl font-normal mb-2">Endereço: {anunciante?.endereco}</p>
                            </div>
                            <Link href={`/painel-controle/clientes/${anuncianteId}/editar`}>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                                    Editar
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}