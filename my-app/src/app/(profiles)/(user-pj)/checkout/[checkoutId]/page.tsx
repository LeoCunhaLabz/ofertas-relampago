"use client"
import React, { useState, useEffect } from 'react';
import { Title } from "@/components/Title";
import { makeRequest } from '@/../../axios';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { Alert } from '@/components/ui/alert'
import { Success } from '@/components/ui/success'


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
    const [pagSeguroLoaded, setPagSeguroLoaded] = useState(false);
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expireDate: '',
        cvv: ''
    });
    const [offers, setOffers] = useState<OfferModel[]>([]);
    let checkoutId = params.checkoutId;
    const user = useContext(UserContext);
    const email = user?.email;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js";
        script.async = true;
        script.onload = () => setPagSeguroLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        // Fetch offers data based on checkoutId        
        const fetchOffersData = async () => {
            console.log("checkoutId:", checkoutId); // Adicione este log para verificar o valor de checkoutId
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

    const handlePayment = () => {
        if (!pagSeguroLoaded) {
            console.error("PagSeguro SDK not loaded yet.");
            return;
        }

        const card = PagSeguro.encryptCard({
            publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
            holder: formData.cardName,
            number: formData.cardNumber,
            expMonth: formData.expireDate.split('-')[1],
            expYear: formData.expireDate.split('-')[0],
            securityCode: formData.cvv
        });

        console.log("Card encrypted:", card);

        const encryptedCard = card.encryptedCard;
        const hasErrors = card.hasErrors;
        const errors = card.errors;

        if (hasErrors) {
            console.error(errors);
        } else {
            try {
                const res = makeRequest.post(`checkout/payment/${checkoutId}`, {encryptedCard, email });
                console.log("Pagamento realizado com sucesso:", res);

            } catch (error) {
                console.error("Erro ao realizar pagamento:", error);
            }
        }
    };

    return (
        <main className="mt-10 flex flex-wrap justify-center md:justify-between">
            <div className="mb-4 flex max-h-[300px] w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary p-4">
                <Title>Resumo da Compra</Title>
                <p className="mb-3">
                    Pacote: { offers[0]?.package_name } 
                    <br />
                    Nº de Créditos: { offers[0]?.credits }
                    <br />
                </p>
                <p className="font-semibold text-2xl">
                    Preço Total: R$ { offers[0]?.price }
                </p>
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
                <button
                    className="mt-2 rounded-lg bg-green-400 py-4 px-4 text-sm font-semibold uppercase mb-4"
                    onClick={handlePayment}
                >
                    Finalizar Pagamento
                </button>
            </div>
        </main>
    );
}