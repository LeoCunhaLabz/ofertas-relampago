"use client"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Title } from '@/components/Title';
import { useEffect, useState } from "react";
import { NovoAnunciante } from "@/models";
import { EventCardHome } from "@/components/EventCardHome";
import { makeRequest } from "@/../../axios";

export default function Page() {
  const [events, setEvents] = useState<NovoAnunciante[]|undefined>(undefined);
  
  useEffect(() => {
          makeRequest.post("post/get6posts", { }).then((res) => {
              setEvents(res.data.data)
          }).catch((err) => {
              console.log(err)
          })
  },[])

  // Função para converter strings de data para objetos Date
  const parseProductDates = (product: { data_cadastro: string | number | Date; data_fim_oferta: string | number | Date; }) => ({
      ...product,
      data_cadastro: new Date(product.data_cadastro),
      data_inicio_oferta: new Date(), // Add a default value for data_inicio_oferta
      data_fim_oferta: new Date(product.data_fim_oferta),
  });

  // Convertendo datas de todos os produtos
  const dataWithParsedDates = events?.map(parseProductDates) ?? [];

  // Funções para obter os conjuntos de produtos
  const getNearerProducts = (data: any[]) => data
  .sort((a, b) => b.ativo - a.ativo).slice(0, 30);    
  const nearerProducts = getNearerProducts(dataWithParsedDates);


  return (
    <section className="text-gray-400 body-font">
      <Header />
      <div className="max-w-7xl mx-auto flex px-5 py-12 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col justify-between md:items-start md:text-left mb-5 items-center text-center">
          <h1 className="mb-5 sm:text-6xl text-5xl items-center Avenir xl:w-2/2 text-gray-900">
            Descubra ofertas exclusivas perto de você
          </h1>
          <p className="mb-6 xl:w-3/4 text-gray-600 text-lg">
            Aproveite descontos imperdíveis antes que esgotem!
          </p>
          <div className="flex justify-center">
            <a
              className="inline-flex items-center px-5 py-3 mt-2 text-2xl font-semibold text-white transition duration-500 ease-in-out transform bg-red-500 border rounded-xl hover:bg-red-400"
              href="/login"
            >
              <span className="justify-center">Quero aproveitar!</span>
            </a>
          </div>
        </div>
        <div className="xl:mr-36 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-48 md:pl-10">
          <img
            className="w-80 md:ml-1 ml-24"
            alt="iPhone-12"
            src="/iphone12-mockup.png"  
          ></img>
        </div>
      </div>
      <Title className='text-black text-center'>Algumas Ofertas Exclusivas</Title>
            <div className="justify-center my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearerProducts?.map((event) => (
                    <EventCardHome key={event.id_anuncio} event={event} />
                ))}
            </div>
      <Footer />
    </section>
  );
}
