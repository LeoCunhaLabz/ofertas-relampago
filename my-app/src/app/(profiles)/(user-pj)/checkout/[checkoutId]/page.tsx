"use client"
import React, { useState, useEffect } from 'react';
import { Title } from "@/components/Title";
import { makeRequest } from '@/../../axios';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { Alert } from '@/components/ui/alert'
import { Success } from '@/components/ui/success'
import { useRouter } from 'next/navigation';
import { Header } from '@/components/HeaderPJ';

interface OfferModel {
    checkout_id: string;
    package_name: string;
    credits: string;
    price: string;
}

export default function CheckoutPagePJ({ 
    params 
}: {
    params: {
        checkoutId: string
    }
}) {
    const router = useRouter();
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [pagSeguroLoaded, setPagSeguroLoaded] = useState(false);
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expireDate: '',
        cvv: ''
    });
    const [offers, setOffers] = useState<OfferModel[]>([]);
    let checkoutId = params.checkoutId;
    const user = useContext(UserContext) as { user: { email: string, nome_comercial: string, cnpj: string, id: string } };
    const email = user?.user?.email;
    const nome_comercial = user?.user?.nome_comercial;
    const cnpj = user?.user?.cnpj;
    const user_id = user?.user?.id;
    const [publicKey, setPublicKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);


    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js";
        script.async = true;
        script.onload = () => setPagSeguroLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        // Fetch offers data based on checkoutId        
        const fetchOffersData = async () => {
            try {
                const response = await makeRequest.get(`checkout/offers/${checkoutId}`);
                const data = response.data;
                setOffers([data]);
                console.log(offers)
            } catch (error) {
                console.error("Error fetching offers data:", error);
            }
        };
        if (checkoutId) {
            fetchOffersData();
        }
    }, [checkoutId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const fetchPublicKey = async () => {
            try {
                const res = await makeRequest.get('auth/public-key');
                setPublicKey(res.data.publicKey)
            } catch (error) {
                console.error('Error fetching public key:', error);
            }
        };

        fetchPublicKey();
    }, []);

    const handlePayment = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        if (!pagSeguroLoaded) {
            setError("Ambiente PagSeguro ainda não carregou.");
        } else if ((window as any).PagSeguro) {
            const card = (window as any).PagSeguro.encryptCard({
                publicKey: publicKey,
                holder: formData.cardName,
                number: formData.cardNumber,
                expMonth: formData.expireDate.split('-')[1],
                expYear: formData.expireDate.split('-')[0],
                securityCode: formData.cvv
            });

            const encryptedCard = card.encryptedCard;
            const hasErrors = card.hasErrors;
            const errors = card.errors;

            if (hasErrors) {
                console.error(errors);
                setError("Cartão inválido, por favor corrija os dados.");
            } else {
                try {
                    const res = await makeRequest.post(`checkout/payment/${checkoutId}`, { user_id, nome_comercial, encryptedCard, email, cnpj });
                    console.log(res);
                    
                    const status = res.data.charges[0].status;
                    const transactionId = res.data.id;
                    const chargeId = res.data.charges[0].id;
                    
                    if (status === "PAID" || status === "AUTHORIZED") {
                        setError('')
                        setSuccess("Pagamento autorizado com sucesso! Redirecionando...");
                        setIsPaymentSuccessful(true);

                        setTimeout(() => {
                            router.push(`/sucesso?transactionId=${transactionId}&chargeId=${chargeId}`);
                        }, 3000);
                    } else if (status === "DECLINED") {
                        setSuccess('')
                        setError("Pagamento não autorizado.");
                        setIsLoading(false);
                    } else {
                        setSuccess('')
                        setError("Pagamento não foi concluído. Tente novamente.");
                        setIsLoading(false);
                    }

                } catch (error) {
                    setError("Erro! Por favor, confira seus dados de cadastro. ");
                } finally {
                }
            }
        } else {
            setError("Erro ao criptografar o cartão.");
        }
        setIsLoading(false)
    }

    return (
        <main className="mt-10 flex flex-wrap justify-center md:justify-between">
            <Header />
                <div className="mb-4 flex w-full h-full max-w-[478px] flex-col gap-y-2 rounded-2xl bg-secondary p-6 shadow-lg">
                    <Title className="text-2xl font-bold mb-6">Resumo da Compra</Title>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <p className="text-lg font-semibold mb-2">Pacote</p>
                        <p className="text-gray-600">{offers[0]?.package_name}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <p className="text-lg font-semibold mb-2">Nº de Créditos</p>
                        <p className="text-gray-600">{offers[0]?.credits}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <p className="text-lg font-semibold mb-2">Preço Total</p>
                        <p className="text-2xl font-bold text-gray-800">R$ {offers[0]?.price}</p>
                    </div>
                </div>
                <div className="w-full max-w-[650px] rounded-2xl bg-secondary p-4">
                    <Title className="mb-6">Informações de Pagamento</Title>
                    <div className="flex flex-col">
                        <label htmlFor="cardName">Nome no Cartão</label>
                        <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="mb-6 border-solid rounded p-2 h-10 bg-input"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="cardNumber">Número do Cartão</label>
                        <input
                            type="number"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="mb-6 border-solid rounded p-2 h-10 bg-input"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="expireDate">Vencimento</label>
                        <input
                            type="month"
                            name="expireDate"
                            value={formData.expireDate}
                            onChange={handleInputChange}
                            className="mb-6 border-solid rounded p-2 h-10 bg-input"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="cvv">CVV</label>
                        <input
                            type="number"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="mb-6 border-solid rounded p-2 h-10 bg-input"
                        />
                    </div>
                    {error && <Alert>{error}</Alert>}
                    {success && <Success>{success}</Success>}
                    {!isPaymentSuccessful && (
                        <button
                            className="mt-2 rounded-lg bg-green-400 py-4 px-4 text-sm font-semibold uppercase mb-4"
                            onClick={handlePayment}
                            disabled={isLoading}
                        >
                            {isLoading ? "PROCESSANDO..." : "FINALIZAR PAGAMENTO"}
                        </button>
                    )}
                </div>
        </main>
    );
}