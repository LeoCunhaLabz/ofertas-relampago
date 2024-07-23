"use client";

import React, { createContext, useState, useEffect } from "react";

interface Anunciante {
    id: string;
    data_cadastro: string;
    cnpj: string;
    razao_social: string;
    nome_comercial: string;
    email: string;
    endereco: string;
    moedas: string;
    habilitado: string;
    termos_uso: string;
    imagem_url: string;
    username: string;
    password: string;
    latitude: string;
    longitude: string;
    }

interface Cliente {
    id: string;
    data_cadastro: string;
    cpf: string;
    celular: string;
    email: string;
    genero: string;
    habilitado: string;
    imagem_url: string;
    moedas: string;
    nascimento: string;
    nome_completo: string;
    termos_uso: string;
    username: string;
    endereco: string;
    latitude: string;
    longitude: string;
}

type User = Anunciante | Cliente | undefined;


interface UserContextType {
    latitude: any;
    longitude: any;
    user: User;
    setUser: (newState: any) => void;
}

const initialValue: UserContextType = {
    user: undefined,
    setUser: () => { },
    latitude: undefined,
    longitude: undefined
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(initialValue.user);
    const latitude = undefined; // Declare latitude variable
    const longitude = undefined; // Declare longitude variable

    useEffect(() => {
        const userType = localStorage.getItem("ofertas-relampago:userType");
        let UserJSON = localStorage.getItem("ofertas-relampago:user");
        if (UserJSON) {
            const parsedUser = JSON.parse(UserJSON);
            if (userType === 'anunciante' || userType === 'cliente') {
                setUser(parsedUser as User);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, latitude, longitude }}>
            {children}
        </UserContext.Provider>
    );
}