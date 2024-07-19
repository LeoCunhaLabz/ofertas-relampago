'use client';

import { useEffect, useState } from "react";
import { Title } from "@/components/Title";
import { NovoAnunciante } from "@/models";
import { EventCard } from "@/components/EventCard";
import { Header } from "@/components/HeaderPF";
import { makeRequest } from "@/../../axios";
import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'

export default function Homepage(){
    const [events, setEvents] = useState<NovoAnunciante[]|undefined>(undefined);
    const { user } = useContext(UserContext);
    const emailUser = user?.email
    const latitude = user?.latitude
    const longitude = user?.longitude
    
    useEffect(() => {
        if (emailUser && latitude && longitude) {
            makeRequest.post("post/getposthomepage", { email: emailUser, latitude: latitude, longitude: longitude }).then((res) => {
                setEvents(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    },[emailUser, latitude, longitude])

    // Função para converter strings de data para objetos Date
    const parseProductDates = (product) => ({
        ...product,
        data_cadastro: new Date(product.data_cadastro),
        data_inicio_oferta: new Date(product.data_inicio_oferta),
        data_fim_oferta: new Date(product.data_fim_oferta),
    });

    // Convertendo datas de todos os produtos
    const dataWithParsedDates = events?.map(parseProductDates) ?? [];

    // Funções para obter os conjuntos de produtos
    const getNearerProducts = (data) => data
    .sort((a, b) => a.distance - b.distance).slice(0, 30)
    .sort((a, b) => b.ativo - a.ativo).slice(0, 30);    
    const nearerProducts = getNearerProducts(dataWithParsedDates);


    return (
        <main className="w-full mt-0">
            <Header />
            <Title>Ofertas Fresquinhas!</Title>
            <div className="justify-center my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearerProducts?.map((event) => (
                    <EventCard key={event.id_anuncio} event={event} />
                ))}
            </div>
        </main>
    )
}