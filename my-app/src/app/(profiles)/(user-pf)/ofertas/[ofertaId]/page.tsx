"use client"

import { UniqueEventModel } from "@/models";
import {UniqueEvent} from "@/components/UniqueEvent";
import React, { useEffect, useState } from "react";
import { makeRequest } from "@/../../axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function DetalhesOferta({ 
    params 
}: {
    params: {
        ofertaId: string
    }
}) {
    const [event, setEvent] = useState<UniqueEventModel[]|undefined>(undefined);
    const ofertaId = params.ofertaId;
    const { user } = useContext(UserContext);
    const [userType, setUserType] = useState("");
    const latitude = user?.latitude
    const longitude = user?.longitude

    const idAnunciante = user?.id;
    
    useEffect(() => {
        setUserType(localStorage.getItem("ofertas-relampago:userType"))
        if (userType && idAnunciante) {
            makeRequest.post("post/getuniquepost", { oferta_id: ofertaId, user_type: userType, id_anunciante: idAnunciante, latitude: latitude, longitude: longitude }).then((res) => {
                setEvent(res.data.data)
            }).catch((err) => {
                console.log(err);
            }
        )}
    },[ofertaId, idAnunciante, userType, latitude, longitude])

    return ( 
    <main className="mt-10">
        {event ? (
        <UniqueEvent event={event[0]} />
        ) : (
            <p></p>
        )}
    </main>
    )
}