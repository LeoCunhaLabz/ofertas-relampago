"use client"

import { NovoAnunciante, AnuncianteModel, UniqueEventModel } from "@/models";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Success } from "@/components/ui/success";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importe o locale que você deseja usar
import React, { useEffect, useState } from "react";
import { makeRequest } from "@/../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

export default function DetalhesOferta({ 
    params 
}: {
    params: {
        anuncianteId: string
    }
}) {

    const [anunciante, setAnunciante] = useState<AnuncianteModel[]|undefined>(undefined);
    const anuncianteId = params.anuncianteId;
    const { user } = useContext(UserContext);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const userTypeFromLocalStorage = localStorage.getItem("ofertas-relampago:userType");
        if (userTypeFromLocalStorage && anuncianteId && user?.email) {
            setUserType(userTypeFromLocalStorage);
            makeRequest.post("post/getoneanunciante", { email: user?.email, id: anuncianteId }).then((res) => {
                setAnunciante(res.data.data[0]);
            }).catch((err) => {
                console.log(err);
            })}
    }, [user, anuncianteId]);

    const handleAprovar = async () => {
        await makeRequest.post("post/aprovacao", { habilitado: true, email:user?.email, user_type:userType, id: anuncianteId }).then(() => {
            window.location.reload();
        })}
    
      // Manipulador para reprovar anunciante
    const handleReprovar = async () => {
        await makeRequest.post("post/aprovacao", { habilitado: false, email:user?.email, user_type:userType, id: anuncianteId }).then(() => {
            window.location.reload();
        })}
    
    return (    
        <main className="flex-col flex justify-center align-middle max-h-full">
            <div>
                <h1 className="text-3xl font-semibold mt-10 mb-6">Anunciante</h1>
                <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-start">
                    <div className="w-full flex flex-col md:flex-row items-center bg-secondary p-2 overflow-hidden">
                        <div className='py-2 flex relative justify-center items-center w-[240px] h-[240px] md:w-[400px] rounded-2xl'>
                        <img src={/*anunciante?.imagem_url && anunciante?.imagem_url.length > 0 ? anunciante?.imagem_url : */'/genericcompany.png'} alt="Imagem do Anunciante" className="mx-auto md:w-1/2 rounded-2xl h-36 object-scale-down mb-2" />
                        </div>
                        <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
                            <h1 className="text-3xl font-semibold mt-0 uppercase">{anunciante && anunciante[0]?.nome_comercial}</h1>
                            <div className='mb-8'>
                            <p className="text-sm">Data de cadastro: {anunciante && anunciante.length > 0 && anunciante[0].data_cadastro ? format(new Date(anunciante[0].data_cadastro), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'}</p>                            </div>
                            <div>
                                <p className="text-xl font-normal mb-2">CNPJ: {anunciante && anunciante[0]?.cnpj}</p>
                                <p className="text-xl font-normal mb-2">Razão Social: {anunciante && anunciante[0]?.razao_social}</p>
                                <p className="text-xl font-normal mb-2">Email: {anunciante && anunciante[0]?.email}</p>
                                <p className="text-xl font-normal mb-2">Endereço: {anunciante && anunciante[0]?.endereco}</p>
                                <p className="text-xl font-normal mb-2">Créditos: {anunciante && anunciante[0]?.moedas}</p>
                                <p className="text-xl font-normal mb-2">Habilitado? {anunciante && Number(anunciante[0]?.habilitado) === 1 ? 'Sim' : 'Não'}</p>
                                <p className="text-xl font-normal mb-2">Analisado? {anunciante && Number(anunciante[0]?.analisado) === 1 ? 'Sim' : 'Não'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
            <div className="flex flex-row items-center my-4 max-w-[1176px] justify-center">
                {anunciante && Number(anunciante[0]?.analisado) === 0 ? (
                    <>
                        <Button onClick={handleAprovar} className=" text-xl h-32 w-1/2 justify-center bg-green-500 hover:bg-green-700 mx-2">Aprovar Anunciante</Button>
                        <Button onClick={handleReprovar} className=" text-xl h-32 w-1/2 justify-center bg-red-500 hover:bg-red-700 mx-2">Reprovar Anunciante</Button>
                    </>
                ) : anunciante && Number(anunciante[0]?.analisado) === 1 && Number(anunciante[0]?.habilitado) === 0 ? (
                    <Alert>Este anunciante foi reprovado e não pode ser habilitado.</Alert>
                ) : anunciante && Number(anunciante[0]?.analisado) === 1 && Number(anunciante[0]?.habilitado) === 1 ? (
                    <Success>Este anunciante já foi analisado e aprovado.</Success>
                ) : null}
            </div>
        </main>
    )
}