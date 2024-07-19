"use client"

import { NovoAnunciante, AnuncianteModel, UniqueEventModel } from "@/models";
import Link from "next/link";
import { notFound } from "next/navigation"
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'; // Importe o locale que você deseja usar
import React, { useEffect, useState } from "react";
import { makeRequest } from "@/../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { EventCard } from "@/components/EventCard";

export default function DetalhesOferta({ 
    params 
}: {
    params: {
        anuncianteId: string
    }
}) {

    const [event, setEvent] = useState<UniqueEventModel[]|undefined>(undefined);
    const [anunciante, setAnunciante] = useState<AnuncianteModel[]|undefined>(undefined);
    const anuncianteId = params.anuncianteId;
    const { user } = useContext(UserContext);
    const [userType, setUserType] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;

    useEffect(() => {
        const userTypeFromLocalStorage = localStorage.getItem("ofertas-relampago:userType");
        if (userTypeFromLocalStorage && anuncianteId && user?.email) {
            setUserType(userTypeFromLocalStorage);
            makeRequest.post("post/getoneanunciante", { email: user?.email, id: anuncianteId }).then((res) => {
                setAnunciante(res.data.data[0]);
            }).catch((err) => {
                console.log(err);
            });
            makeRequest.post("post/getallpostsanunciante", { email: user?.email, id_anunciante: anuncianteId, user_type: userTypeFromLocalStorage }).then((res) => {
                setEvent(res.data.data);
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
                <h1 className="text-3xl font-semibold mt-10 mb-6">Anunciante</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] rounded-2xl'>
                        <img src={anunciante?.imagem_url && anunciante?.imagem_url.length > 0 ? anunciante?.imagem_url : '/genericcompany.png'} alt="Imagem do Anunciante" className="mx-auto md:w-1/2 rounded-2xl h-36 object-scale-down mb-2" />
                        </div>
                        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
                            <h1 className="text-3xl font-semibold mt-0 uppercase">{anunciante?.nome_comercial}</h1>
                            <div className='mb-8'>
                                <p className="text-sm">Data de cadastro: {anunciante?.data_cadastro ? format(new Date(anunciante.data_cadastro), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'}</p>                            </div>
                            <div>
                                <p className="text-xl font-normal mb-2">CNPJ: {anunciante?.cnpj}</p>
                                <p className="text-xl font-normal mb-2">Nome de Usuário: {anunciante?.username}</p>
                                <p className="text-xl font-normal mb-2">Razão Social: {anunciante?.razao_social}</p>
                                <p className="text-xl font-normal mb-2">Email: {anunciante?.email}</p>
                                <p className="text-xl font-normal mb-2">Endereço: {anunciante?.endereco}</p>
                                <p className="text-xl font-normal mb-2">Moedas: {anunciante?.moedas}</p>
                                <p className="text-xl font-normal mb-2">Habilitado? {anunciante?.habilitado === 1 ? 'Sim' : 'Não'}</p>
                                <p className="text-xl font-normal mb-2">Analisado? {anunciante?.analisado === 1 ? 'Sim' : 'Não'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-semibold mt-10 mb-6">Ofertas Postadas ({event?.length}) </h1>
                <div className="justify-center mt-8 sm:grid sm:grid-cols-auto-fit-cards flex flex-wrap gap-x-2 gap-y-4">
                    {currentEvents?.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    {Array.from({ length: Math.ceil((event || []).length / eventsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    )
}