"use client"

import { Title } from "@/components/Title";
import { UserContext } from '@/context/UserContext'
import { useEffect, useState, useContext } from "react";
import { makeRequest } from "@/../../axios";
import { EventCard } from "@/components/AnuncianteCard";
import { AnuncianteModel } from "@/models";

export default function PainelControleClientes() {
    const [events, setEvents] = useState<AnuncianteModel[]>([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            makeRequest.post("post/getallanunciantes", { email: user?.email }).then((res) => {
                setEvents(res.data.data
                    .filter((event: { analisado: number; }) => event.analisado === 1)
                    .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id));
            }).catch((err) => {
                console.log(err)
            })
        }
    },[user])
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events?.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="w-full mt-0">
      <Title className="text-center">Anunciantes: {events.length} </Title>
      <div className="justify-center mt-8 sm:grid sm:grid-cols-auto-fit-cards flex flex-wrap gap-x-2 gap-y-4">
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
      )}