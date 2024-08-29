"use client"

import { Title } from "@/components/Title";
import { UserContext } from '@/context/UserContext'
import { useEffect, useState, useContext } from "react";
import { makeRequest } from "@/../../axios";
import { AnuncianteModel } from "@/models";
import Link from "next/link";
import React from "react";

export default function PainelControleClientes() {
    const [events, setEvents] = useState<AnuncianteModel[]>([]);
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (user) {
            makeRequest.post("post/getallanunciantes", { email: user?.email }).then((res) => {
                setEvents(res.data.data
                    .filter((event: { analisado: number; }) => event.analisado === 0)
                    .sort((a: { id: number; }, b: { id: number; }) => Number(b.id) - Number(a.id)));
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [user]);

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events
        ?.filter(event => event.nome_comercial.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="w-full mt-0">
            <Title className="text-center">Aprovações Pendentes: {events.length} </Title>
            <div className="flex justify-center mt-4">
                <input
                    type="text"
                    placeholder="Buscar por nome comercial"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mt-8">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Data de Cadastro</th>
                            <th className="py-2">Nome Comercial</th>
                            <th className="py-2">CNPJ</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEvents?.map((event) => (
                            <tr key={event.id}>
                                <td className="border px-4 py-2">{new Date(event.data_cadastro).toLocaleDateString()}</td>
                                <td className="border px-4 py-2 hover:font-bold">
                                    <Link href={`/painel-controle/anunciantes/${event.id}`}>
                                        {event.nome_comercial}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2">{event.cnpj}</td>
                                <td className={`border px-4 py-2 ${Number(event.analisado) === 0 ? 'text-black' : 'text-green-500'}`}>
                                    {Number(event.analisado) === 0 ? <strong>Pendente</strong> : "Aprovado"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil((events || []).length / eventsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </main>
    )
}