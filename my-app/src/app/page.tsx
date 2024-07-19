"use client"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';

export default function Page() {

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
      <div className="grr max-w-7xl mx-auto text-center">
        <h1 className="mb-8 text-6xl Avenir font-semibold text-gray-900">
          Ofertas incríveis, todos os dias.
        </h1>
        <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
          Acesse promoções incríveis de mercados próximos sem sair do seu celular.
        </h1>
        <div className="container flex flex-col items-center justify-center mx-auto rounded-lg ">
          <img
            className="object-cover object-center w-3/4 mb-10 g327 border rounded-lg shadow-md"
            alt="Placeholder Image"
            src="/placeholder-lp.png"
          ></img>
        </div>
      </div>
      <Footer />
    </section>
  );
}
