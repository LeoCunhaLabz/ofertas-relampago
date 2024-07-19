import { AnuncianteModel } from "@/models";
import Link from "next/link";
import React from "react";

export type EventCardProps = {
    event: AnuncianteModel;
}

export function EventCard(props: EventCardProps) {
    return (
        <div className="flex justify-center">
            <Link href={`/painel-controle/anunciantes/${props.event.id}`}>
                <div className="flex w-[277px] flex-col rounded-2xl bg-secondary p-2">
                    <div className=" py-2 flex justify-center items-center w-[261px] h-[261px] bg-white rounded-2xl">
                        <img src={props.event.imagem_url || '/genericcompany.png'} alt={props.event.nome_comercial} className="rounded-2xl bg-white object-contain max-w-full max-h-full p-2" />
                    </div>
                    <div className="flex flex-col gap-y-2 px-4 py-6">
                    {Number(props.event.habilitado) === 1 ? (
                        <p className="text-sm font-normal text-secondary-light mt-0">
                            Cadastrado em {new Date(props.event.data_cadastro).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                        </p>
                    ) : (
                        <p className="text-base font-semibold text-red-500 mt-0">Anunciante Negado</p>
                    )}
                        <p className="text-xl font-bold text-gray-800 mr-2 ">{props.event.nome_comercial}</p>
                        <div className="flex items-center">
                            <p className="font-semibold">CNPJ: {props.event.cnpj}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
