import React from 'react';
import { UniqueEventModel } from "@/models";
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import Image from 'next/image';

export type UniqueEventCardProps = {
    event: UniqueEventModel;
}



export function     UniqueEvent(props: UniqueEventCardProps) {

    const { user } = useContext(UserContext);

    const userAddress = `${user?.latitude},${user?.longitude}`;
    const storeAddress = `${props.event.latitude},${props.event.longitude}`;
    return (
        <div>
            <div>
            <h1 className="text-3xl font-semibold mt-10 mb-6">Anunciante</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
{/*                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] rounded-2xl'>
                        <img src={props.event.imagem_url_anunciante && props.event.imagem_url_anunciante.length > 0 ? props.event.imagem_url_anunciante : '/genericcompany.png'} alt="Imagem do Anunciante" className="mx-auto md:w-1/2 rounded-2xl h-36 object-scale-down mb-2" />
                        </div> */}
                        <div className="md:w-full md:pl-6 mt-4 md:mt-0 flex flex-col">
                            <h1 className="text-3xl font-semibold mt-0 uppercase">{props.event.nome_comercial}</h1>
                            <div className='mb-8'>
                                <p className="text-sm">CPNJ: {props.event.cnpj}</p>
                            </div>
                            <div>
                                <p className="text-xl font-normal mb-2">Endereço: {props.event.endereco_loja}</p>
                            </div>
                            <div>
                                <a href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userAddress)}&destination=${encodeURIComponent(storeAddress)}`} target="_blank" rel="noopener noreferrer">
                                    <button className=' flex items-center justify-center my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl'>
                                        <img src="/maps.svg" alt="Maps" className="h-10 w-10 mr-2" />
                                        Ir para o Google Maps
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
            <h1 className="text-3xl font-semibold mt-10 mb-6">Oferta</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] md:h-[400px] bg-white rounded-2xl'>
                            <img src={props.event.imagem_url} alt="Imagem da Oferta" className="rounded-2xl bg-white object-contain max-w-full max-h-full" />
                        </div>
                        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col gap-y-6">
                            <h1 className="text-3xl font-semibold mt-3">{props.event.nome_produto}</h1>
                            <div>
                                {props.event.ativo === 1 ? (
                                <p className="text-sm">
                                    Até {new Date(props.event.data_fim_oferta).toLocaleString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                ) : (
                                    <p className="text-xl font-semibold text-red-500">Esgotado</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xl font-normal line-through text-black">R$ {Number(props.event.preco_original).toFixed(2)}</p>
                                <div className="flex items-center mt-2">
                                    <p className="text-3xl font-bold text-red-500 mr-3">R$ {Number(props.event.preco_oferta).toFixed(2)}</p>
                                    <p className="text-xl font-semibold text-red-500">(-{((1 - Number(props.event.preco_oferta) / Number(props.event.preco_original)) * 100).toFixed(0)}%)</p>
                                </div>
                            </div>
                            <div className="text-gray-800 text-lg leading-7">
                                <p className="mb-4">Categoria: {props.event.categoria_produto}</p>
                                <p className="mb-4">Marca: {props.event.marca_produto}</p>
                                <p className="mb-4">Descrição: {props.event.descricao_oferta}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
