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
    const { user_id, nome_comercial, email, encryptedCard, cnpj } = req.body;
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
            url: pagseguro_url,
            headers: {
              accept: '*/*',
              Authorization: pagseguro_token,
              'content-type': 'application/json'
            },
            data: {
              customer: {name: nome_comercial, email: email, tax_id: cnpj},

              reference_id:`${new Date().toISOString()}_${user_id}_${checkout_id}`,

              items: [
                {
                  reference_id: "Id de checkout: " + checkout_id,
                  name: package_name,
                  quantity: credits,
                  unit_amount: price * 100
                }
              ],
              charges: [
                {
                  reference_id: `${new Date().toISOString()}_${user_id}_${checkout_id}`,
                  description: 'Aquisição de ' + credits + ' créditos em Ofertas Relâmpago',
                  amount: {
                    value: price * 100, 
                    currency: 'BRL'
                  },
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
              ],
              notification_urls: [
                'https://api.ofertarelampago.app.br/api/checkout/webhook'
              ],
            }
          };
          
          axios
          .request(options)
          .then(function (response) {
            console.log(response.data.charges[0].status)  
            return res.status(200).json(response.data);
          })
          .catch(function (error) {
            res.status(400).json(error.response.data.error_messages[0].description);
          });
    } catch (error) {
      if (error.response) {
        console.error('Erro ao processar pagamento:', error);
      } else {
        res.status(500).json({ message: 'Erro Interno' });
      }
    }
}

export const webhook = async (req, res) => {
  const { notificationCode, notificationType, token_api } = req.body;

    if (notificationType !== 'transaction') {
        return res.status(400).json({ message: 'Tipo de notificação inválido' });
    }

    try {
        const pagseguro_url = `${process.env.PAGSEGURO_WEBHOOK}/v3/transactions/notifications/${notificationCode}?email=${process.env.PAGSEGURO_EMAIL}&token=${process.env.PAGSEGURO_TOKEN}`;
        
        const response = await axios.get(pagseguro_url);
        const transaction = response.data;

        if (transaction.status === '3' || transaction.status === '4') { // 3 = Pago, 4 = Disponível
            const userId = transaction.reference_id.split('_')[1];
            const creditsToAdd = transaction.items[0].quantity;
            console.log('Créditos a adicionar:', creditsToAdd, 'para o usuário:', userId);

            // Atualizar créditos do usuário no banco de dados
            await db.query("UPDATE anunciantes SET credits = credits + ? WHERE id = ?", [creditsToAdd, userId]);

            return res.status(200).json({ message: 'Créditos adicionados com sucesso' });
        } else {
            return res.status(200).json({ message: 'Transação não está paga' });
        }
    } catch (error) {
        console.error('Erro ao processar notificação:', error);
        return res.status(500).json({ message: 'Erro Interno' });
    }
}