import { Title } from "@/components/Title";
import { EventModel } from "@/models";
import Link from "next/link";
import { notFound } from "next/navigation"

import React from "react";

export default function SucessoCompra({ 
    params 
}: {
    params: {
        ofertaId: string
    }
}) {
    if(parseInt(params.ofertaId) < 1 ) {
        notFound();
    }

    const event: EventModel = {
        id: "1",
        name: "Básico",
        balance: "1000",
        date: "2022-12-31T00:00:00.000Z",
        location: "São Paulo",
        quantity: "100",
    };

    return (    
        <main className="flex justify-center align-middle max-h-full">
            <div className="flex flex-col gap-y-4">
                <Title className="mb-6">OFERTA POSTADA COM SUCESSO!</Title>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center  gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <img src="data:image/png;base64,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" alt="Imagem da Oferta" />
                            <div className="flex max-w-full flex-col gap-y-6">
                                <div className="flex flex-col gap-y-2">
                                    <p className="text-2xl font-semibold">Informações da Oferta</p>
                                    <p className="font-normal">Créditos Utilizados: TO DO</p>
                                    <p className="font-normal">Valor Original: {event.location}</p>
                                    <p className="font-normal">Valor com Desconto: {event.location}</p>
                                    <p className="font-normal">Duração da Oferta: {event.location}</p>

                                </div>
                            </div>
                </div>
            </div>
        </main>
    )
}