'use client';

import { useEffect, useState } from "react";
import { Title } from "@/components/Title";
import { NovoAnunciante } from "@/models";
import { EventCard } from "@/components/EventCard";
import { Header } from "@/components/HeaderPF";
import { makeRequest } from "@/../../axios";
import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'
import Image from 'next/image';
import React from 'react';
import { EventModel } from "@/models";

export default function Ofertas(){
    const [events, setEvents] = useState<NovoAnunciante[]|undefined>(undefined);
    const [filteredEvents, setFilteredEvents] = useState<NovoAnunciante[]>([]);
    const [keyword, setKeyword] = useState('');
    const [categoria, setCategoria] = useState('');
    const [categories, setCategories] = useState<EventModel[]|undefined>(undefined);
    const [distMax, setDistMax] = useState<number | ''>('');
    const { user } = useContext(UserContext);
    const emailUser = user?.email
    const latitude = user?.latitude
    const longitude = user?.longitude
    
    useEffect(() => {
      fetchCategories(); // Buscar categorias quando o componente é montado
    }, []);
  
    const fetchCategories = async () => {
      const response = await makeRequest.get('category/see');
      setCategories(response.data);
    }

    
    useEffect(() => {
        if (emailUser && latitude && longitude) {
            makeRequest.post("post/getposthomepage", { email: emailUser, latitude: latitude, longitude: longitude }).then((res) => {
                setEvents(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [emailUser, latitude, longitude])
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 9;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      // Supondo que `events` já esteja preenchido com os dados da requisição
      const filterEvents = () => {
        let tempEvents = events?.filter(event => 
          (keyword === '' || event.nome_produto.toLowerCase().includes(keyword.toLowerCase()) || event.descricao_oferta.toLowerCase().includes(keyword.toLowerCase())) &&
          (categoria === '' || event.categoria_produto.toLowerCase().includes(categoria.toLowerCase())) &&
          (distMax === '' || event.distance <= +distMax)
        );
        setFilteredEvents(tempEvents ?? []);
      };
  
      filterEvents();
    }, [events, keyword, categoria, distMax]);


    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents?.slice(indexOfFirstEvent, indexOfLastEvent) ?? [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className="w-full mt-0">
            <Header />
            <div className="flex mt-10">
                <button
                  className="block sm:hidden fixed bottom-4 right-4 z-50 p-2 bg-gray-200 text-white rounded-full border-2 border-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                        <Image
                        src="/close-x.svg"
                        width={32}
                        height={32}
                        alt='Fechar Menu'
                        />
                    ) : (
                      <Image
                      src="/filtro.svg"
                      width={32}
                      height={32}
                      alt='Abrir Filtros'
                      />
                    )}
                </button>
                <aside className={`h-full fixed rounded-2xl inset-0 z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 transition-transform duration-300 ease-in-out sm:block sm:w-1/4 p-4 bg-white shadow-lg text-gray-800`}>
                  <nav>
                    <ul className="space-y-4 mb-4">
                      <li>
                        <Title className="justify-center">Filtrar</Title>
                      </li>
                      <li>
                        <label htmlFor="keyword" className="block font-medium text-gray-700">Produto Procurado</label>
                        <input
                          id="keyword"
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </li>
                      <li>
                        <label htmlFor="categoria" className="block">Categoria</label>
                        <select
                          id="categoria"
                          value={categoria}
                          onChange={(e) => setCategoria(e.target.value)}
                          className="overflow-visible w-full p-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                        >
                          <option value=""></option>
                          {categories?.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                          </select>
                      </li>
                      <li className="flex items-center">
                        <label htmlFor="distMax" className="block font-medium text-gray-700">Distância</label>
                          <input
                          id="distMax"
                          type="number"
                          value={distMax}
                          onChange={(e) => setDistMax(Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded mx-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                          placeholder="Máx."
                          />
                      </li>
                    </ul>
                  </nav>
                </aside>
                <div className="flex-1 ml-4">
                    <Title className="text-center">Ofertas Disponíveis!</Title>
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
                </div>
            </div>
        </main>
    )
}