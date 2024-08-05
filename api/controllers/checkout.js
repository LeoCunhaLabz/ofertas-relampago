import { db } from '../connect.js';
import axios from 'axios';
import dotenv from 'dotenv';

const offers = [
    { checkout_id: '1', package_name: 'Basic Package', credits: 100, price: 10.00 },
    { checkout_id: '2', package_name: 'Standard Package', credits: 200, price: 10.00 },
    { checkout_id: '3', package_name: 'Premium Package', credits: 300, price: 10.00 },
    // Adicione mais ofertas conforme necessário
];

const addCredits = async (userId, creditsToAdd) => {
  try {
    await db.query("UPDATE anunciantes SET moedas = moedas + ? WHERE id = ?", [creditsToAdd, userId]);
    console.log('Créditos adicionados com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao adicionar créditos:', error);
    return false;
  }
}

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
            }
          };
          axios
          .request(options)
          .then(function (response) {
            const charge = response.data.charges[0];
            console.log(charge.status)

            if (charge.status === 'PAID' || charge.status === 'AUTHORIZED') {
              const creditsAdded = addCredits(user_id, credits);

              const insertQuery = `
                          INSERT INTO compra_creditos (
                              id_anunciante, 
                              pagseguro_id, 
                              my_reference_id, 
                              order_created_at, 
                              customer_name, 
                              customer_email, 
                              customer_tax_id, 
                              item_name, 
                              item_quantity, 
                              item_unit_amount, 
                              charge_id, 
                              charge_status, 
                              charge_paid_at, 
                              payment_method_type, 
                              card_brand, 
                              card_last_digits, 
                              card_holder_name, 
                              message 
                          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                      `;

              const id_anunciante = user_id;
              let message = '';
              
              if (creditsAdded) {
                message = 'Créditos adicionados com sucesso';
              } else {
                message = 'Pago, mas houve erro ao adicionar créditos'
              }

              const insertValues = [
                id_anunciante, 
                response.data.id, 
                response.data.reference_id, 
                response.data.created_at,  
                response.data.customer.name, 
                response.data.customer.email, 
                response.data.customer.tax_id, 
                response.data.items[0].name, 
                response.data.items[0].quantity, 
                response.data.items[0].unit_amount, 
                charge.id, 
                charge.status, 
                charge.paid_at, 
                charge.payment_method.type, 
                charge.payment_method.card.brand, 
                charge.payment_method.card.last_digits, 
                charge.payment_method.card.holder.name, 
                message, 
              ];

              db.query(insertQuery, insertValues);

              return res.status(200).json(response.data)

            } else {
            return res.status(201).json(response.data);
            }
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

export const retrieve = async (req, res) => {
  const { transactionId, chargeId } = req.body;

  try {
    const rows = await db.query(
      'SELECT * FROM compra_creditos WHERE pagseguro_id = ? AND charge_id = ?', 
      [transactionId, chargeId],(err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        } else {
          return res.status(200).json(result[0]);
        }
      }
    );
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ message: 'Erro ao buscar transação' });
  }
}