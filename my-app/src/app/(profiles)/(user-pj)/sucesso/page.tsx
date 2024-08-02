"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { Title } from "@/components/Title";
import { makeRequest } from '@/../../axios';
import { Header } from '@/components/HeaderPJ';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

interface TransactionInfo {
    order_created_at?: string;
    charge_paid_at?: string;
    charge_status?: string;
    message?: string;
    pagseguro_id?: string;
    my_reference_id?: string;
    item_name?: string;
    item_quantity?: number;
    item_unit_amount?: number;
    payment_method_type?: string;
    card_brand?: string;
    card_last_digits?: string;
    card_holder_name?: string;
}

function Sucesso() {
    const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({});
    const router = useRouter();
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId');
    const chargeId = searchParams.get('chargeId');

    useEffect(() => {
        const fetchTransactionInfo = async () => {
            if (transactionId && chargeId) {
                try {
                    const res = await makeRequest.post(`checkout/retrieve/`, { transactionId, chargeId });
                    setTransactionInfo(res.data);
                } catch (error) {
                    console.error('Erro ao buscar transação:', error);
                }
            }
        };
        fetchTransactionInfo();
    }, [transactionId, chargeId]);

    const formattedOrderCreatedAt = transactionInfo?.order_created_at
        ? format(new Date(transactionInfo.order_created_at), 'dd/MM/yyyy HH:mm')
        : 'Data não disponível';
    const formattedChargePaidAt = transactionInfo?.charge_paid_at
        ? format(new Date(transactionInfo.charge_paid_at), 'dd/MM/yyyy HH:mm')
        : 'Data não disponível';

    return (
        <main className="mt-10 flex flex-wrap justify-center md:justify-between">
            <Header />
            <div className="w-full rounded-2xl p-6">
                <div className='w-full flex flex-col md:flex-row items-center mb-6 p-4 rounded-lg'>
                    <Title className="text-2xl font-bold mb-2 md:mb-0 md:mr-4">Status:</Title>
                    <p className={`text-white px-4 py-2 rounded-2xl ${transactionInfo?.charge_status === 'PAID' || transactionInfo?.charge_status === 'AUTHORIZED' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {transactionInfo?.message}
                    </p>
                </div>
                {/* Bloco 1: Detalhes da Transação */}
                <div className="w-full rounded-2xl bg-secondary p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Detalhes da Transação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">ID PagSeguro</h3>
                            <p className="text-gray-600">{transactionInfo?.pagseguro_id}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">ID Ofertas Relâmpago</h3>
                            <p className="text-gray-600">{transactionInfo?.my_reference_id}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Pedido Criado em</h3>
                            <p className="text-gray-600">{formattedOrderCreatedAt}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Pedido Pago em</h3>
                            <p className="text-gray-600">{formattedChargePaidAt}</p>
                        </div>
                    </div>
                </div>
                
                {/* Bloco 2: Detalhes do Pacote */}
                <div className="w-full rounded-2xl bg-secondary p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Detalhes do Pacote</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Pacote Adquirido</h3>
                            <p className="text-gray-600">{transactionInfo?.item_name}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Créditos Adicionados</h3>
                            <p className="text-gray-600">{transactionInfo?.item_quantity}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Valor da Transação</h3>
                            <p className="text-gray-600">R$ {(transactionInfo?.item_unit_amount ?? 0) / 100}</p>
                        </div>
                    </div>
                </div>
                
                {/* Bloco 3: Detalhes do Pagamento */}
                <div className="w-full rounded-2xl bg-secondary p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Detalhes do Pagamento</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Meio de Pagamento</h3>
                            <p className="text-gray-600">{transactionInfo?.payment_method_type === 'CREDIT_CARD' ? 'Cartão de Crédito' : transactionInfo?.payment_method_type}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Cartão</h3>
                            <p className="text-gray-600">{transactionInfo?.card_brand?.toUpperCase()}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Últimos 4 dígitos</h3>
                            <p className="text-gray-600">{transactionInfo?.card_last_digits}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Nome no Cartão</h3>
                            <p className="text-gray-600">{transactionInfo?.card_holder_name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function PageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Sucesso />
        </Suspense>
    );
}