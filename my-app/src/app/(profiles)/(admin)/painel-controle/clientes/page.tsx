"use client"

import { Title } from "@/components/Title";
import { UserContext } from '@/context/UserContext'
import { useEffect, useState, useContext } from "react";
import { makeRequest } from "@/../../axios";
import React from "react";
import { ClientModel } from "@/models";
import Link from "next/link";

export default function PainelControleClientes() {
    const [clients, setClients] = useState<ClientModel[]>([]);
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (user) {
            makeRequest.post("post/getallclients", { email: user?.email }).then((res) => {
                setClients(res.data.data);
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [user]);

    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 9;

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients
        ?.filter(client => client.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstClient, indexOfLastClient);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="w-full mt-0">
            <Title className="text-center">Total de Usuários: {clients.length} </Title>
            <div className="flex justify-center mt-4">
                <input
                    type="text"
                    placeholder="Buscar por nome completo"
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
                            <th className="py-2">Nome Completo</th>
                            <th className="py-2">CPF</th>
                            <th className="py-2">Endereço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClients?.map((client) => (
                            <tr key={client.id}>
                                <td className="border px-4 py-2">
                                    {new Date(client.data_cadastro).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="border px-4 py-2 hover:font-bold">
                                    <Link href={`/painel-controle/clientes/${client.id}`}>
                                        {client.nome_completo}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2">{client.cpf}</td>
                                <td className="border px-4 py-2">{client.endereco}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil((clients || []).length / clientsPerPage) }, (_, index) => (
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