import { EventModel } from "@/models";
import Link from "next/link";

export type EventCardProps = {
    event: EventModel;
}

export function EventCard(props: EventCardProps) {
    return (
        <div className="flex flex-wrap justify-center">
            <Link href={`/ofertas/${props.event.id_anuncio}`}>
                <div className="flex w-[277px] flex-col rounded-2xl bg-secondary p-2 h-full">
                    <div className=" py-2 flex justify-center items-center w-[261px] h-[261px] bg-white rounded-2xl">
                        <img src={props.event.imagem_url} alt={props.event.nome_produto} className="rounded-2xl bg-white object-contain max-w-full max-h-full" />
                    </div>
                    <div className="flex flex-col gap-y-2 px-4 py-6 h-full justify-between">
                        <div className="flex-1">
                            {props.event.ativo === 1 ? (
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-normal text-secondary-light mt-0">
                                        Até {new Date(props.event.data_fim_oferta).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                        })} às {new Date(props.event.data_fim_oferta).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false, // Ajuste para formato 24h
                                        })}
                                        <br/>
                                        ou final do estoque.
                                    </p>
                                    {props.event.distance != null ? (
                                        <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                                            {props.event.distance.toFixed(1)} Km
                                        </span>
                                    ) : (
                                        <span className="ml-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                                            ? Km
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <p className="ml-0 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">ESGOTADO</p>
                                    <br/>
                                    <br/>
                                    {props.event.distance != null ? (
                                        <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                                            {props.event.distance.toFixed(1)} Km
                                        </span>
                                    ) : (
                                        <span className="ml-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                                            ? Km
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="font-semibold">{props.event.nome_produto}</p>
                        <div className="flex items-center">
                            <p className="text-2xl font-bold text-red-500 mr-2">R$ {Number(props.event.preco_oferta).toFixed(2)}</p>
                            <p className="text-sm font-normal line-through text-black">R$ {Number(props.event.preco_original).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
