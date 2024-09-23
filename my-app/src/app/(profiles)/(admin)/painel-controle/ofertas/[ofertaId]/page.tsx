"use client"

import { UniqueEventModel } from "@/models";
import {UniqueEvent} from "@/components/UniqueEventAdm";
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
    const emailAdm = user?.email;

    const idAnunciante = user?.id;
    
    useEffect(() => {
        const storedUserType = localStorage.getItem("ofertas-relampago:userType") || ""; // Fallback to an empty string if null
        setUserType(storedUserType);
        if (storedUserType && idAnunciante) {
            makeRequest.post("post/getoneoferta", { oferta_id: ofertaId, latitude: latitude, longitude: longitude, email:emailAdm }).then((res) => {
                setEvent(res.data.data)
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [ofertaId, latitude, longitude, emailAdm]);

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