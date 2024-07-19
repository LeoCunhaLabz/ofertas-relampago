'use client';

import { useEffect, useState } from "react";
import { Title } from "@/components/Title";
import { NovoAnunciante } from "@/models";
import { EventCard } from "@/components/EventCard";
import { Header } from "@/components/HeaderPJ";
import { makeRequest } from "@/../../axios";
import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'

export default function ListaOfertas(){
    const [events, setEvents] = useState<NovoAnunciante[]|undefined>(undefined);
    const { user } = useContext(UserContext);
    const emailUser = user?.email
    console.log({emailUser})

    useEffect(() => {
        makeRequest.post("post/getpost", { email: emailUser }).then((res) => {
            setEvents(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
    },[emailUser])

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events?.slice(indexOfFirstEvent, indexOfLastEvent) ?? [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="w-full mt-0">
            <Header />
            <Title>Minhas Ofertas</Title>
            <div className="justify-center mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentEvents?.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
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