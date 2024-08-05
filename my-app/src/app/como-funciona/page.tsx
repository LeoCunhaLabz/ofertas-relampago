"use client"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Page() {

  return (
    <section className="text-gray-400 body-font">
      <Header />
      <div className="mt-12 max-w-7xl mx-auto text-center">
        <h1 className="mb-8 text-6xl Avenir font-semibold text-gray-900">
          Ofertas incríveis, todos os dias.
        </h1>
        <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
          Acesse promoções incríveis de mercados, serviços e lojas próximas sem sair do seu celular.
        </h1>
        <div className="container flex flex-col items-center justify-center mx-auto rounded-lg ">
          <img
            className="object-cover object-center w-3/4 mb-10 g327 border rounded-lg shadow-md"
            alt="Placeholder Image"
            src="/placeholder-lp.png"
          ></img>
        </div>
        <div className="text-black text-left flex flex-col items-left justify-left mx-auto">
        <p>
          Todos os dias, milhares de ofertas muito especiais, com curta duração, são feitas em diversos mercados em todo o Brasil. 
          Ao mesmo tempo, outros milhares de estabelecimentos de comércio e serviço oferecem promoções imperdíveis em itens de baixo giro ou preços reduzidos para horários de baixo movimento.  
          Entretanto, apenas um pequeno número de pessoas se beneficiam dessas ofertas, somente quem está dentro dos estabelecimentos ou quem vê os cartazes na rua, tomam conhecimento dessas excelentes oportunidades de economia.
        </p>
        <br/>
        <p>
          Sabemos que o dinheiro está curto e queremos ajudá-lo a economizar. Nossa missão é divulgar essas ofertas e levar as oportunidades de compras com desconto para o maior número de pessoas possível.
        </p>
        <br/>
        <p>
          Dessa visão e da necessidade de driblar a carestia, nasceu o <strong>OfertaRelampago.app</strong>. Queremos ser a ponte que leva preços mais baixos aos consumidores e traz soluções para os comerciantes levarem suas ofertas a mais pessoas.
        </p>
        <br/>
        <p>
          Convidamos você a fazer parte deste movimento e valorizar cada centavo do seu suado dinheiro, aproveitando as ofertas e divulgando as promoções para sua família e conhecidos.
        </p>
        <br/>
        <br/>
        <p>Mas tem que ser rápido, porque as ofertas são muito boas e têm curta duração, tem horário para começar e terminar.</p>
        </div>
      </div>
      <Footer />
    </section>
  );
}
