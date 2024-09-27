'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

const ConfirmarEmailUsuario = ({ 
    params 
}: {
    params: {
        token: string
    }
}) => {
    const token = params.token;
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            axios.post(`/api/confirmar-email-usuario/${token}`)
                .then((response) => {
                    setMessage(response.data.message);
                })
                .catch((error) => {
                    setMessage(error.response.data.message);
                });
        }
    }, [token]);

    return (
        <div>
            <h1>Confirmação de Email</h1>
            <p>{message}</p>
        </div>
    );
};

export default ConfirmarEmailUsuario;