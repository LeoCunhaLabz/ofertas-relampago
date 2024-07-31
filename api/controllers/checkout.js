import { db } from '../connect.js';
import axios from 'axios';
import dotenv from 'dotenv';

const offers = [
    { checkout_id: '1', package_name: 'Basic Package', credits: 100, price: 10.00 },
    { checkout_id: '2', package_name: 'Standard Package', credits: 200, price: 10.00 },
    { checkout_id: '3', package_name: 'Premium Package', credits: 300, price: 10.00 },
    // Adicione mais ofertas conforme necessário
];

export const seeOffers = async (req, res) => {
	const { checkoutId } = req.params;

    try {
        // Filtrando as ofertas com base no checkoutId
        const offer = offers.find(offer => offer.checkout_id === checkoutId);

        if (offer) {
            res.status(200).json(offer);
        } else {
            res.status(404).json({ message: 'Sem ofertas encontradas para este ID de checkout' });
        }
    } catch (error) {
        console.error('Error ao buscar oferta:', error);
        res.status(500).json({ message: 'Erro Interno' });
    }
};

export const payment = async (req, res) => {
    
    const { checkoutId } = req.params;
    const { email, encryptedCard } = req.body;
    const offer = offers.find(offer => offer.checkout_id === checkoutId);
    const pagseguro_email = process.env.PAGSEGURO_EMAIL;
    const pagseguro_token = process.env.PAGSEGURO_TOKEN;
    const pagseguro_url = process.env.PAGSEGURO_URL;
    const pagseguro_public_key = process.env.PAGSEGURO_PUBLIC_KEY;

    if (!offer) {
        return res.status(404).json({ message: 'Oferta não encontrada' });
    }

    try {
        const user = db.query("SELECT * FROM anunciantes WHERE email = ?", [email]);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const { checkout_id, package_name, credits, price } = offer;

        const options = {
            method: 'POST',
            url: process.env.PAGSEGURO_URL,
            headers: {
              accept: '*/*',
              Authorization: process.env.PAGSEGURO_TOKEN,
              'content-type': 'application/json'
            },
            data: {
              customer: {name: 'Jose da Silva', email: 'email@test.com', tax_id: '12345678909'},

              reference_id: 'ex-00001',
              items: [
                {
                  reference_id: 'referencia do item',
                  name: 'nome do item',
                  quantity: 1,
                  unit_amount: 500
                }
              ],
              charges: [
                {
                  reference_id: 'referencia da cobranca',
                  description: 'descricao da cobranca',
                  amount: {value: 500, currency: 'BRL'},
                  payment_method: {
                    type: 'CREDIT_CARD',
                    installments: 1,
                    capture: true,
                    card: {
                        encrypted: encryptedCard,
                    },
                    soft_descriptor: 'OFERTA_REL'
                  }
                }
              ]
            }
          };
          
          axios
            .request(options)
            .then(function (response) {
              console.log(response.data);
              return res.status(200).json(response.data);
            })
            .catch(function (error) {
              console.log(error);
            });



    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        res.status(500).json({ message: 'Erro Interno' });
    }
}