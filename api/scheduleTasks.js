import cron from 'node-cron';
import { db } from "./connect.js";

// Tarefa para verificar e atualizar o status das ofertas
const checkAndUpdateOffers = () => {
    const query = `
        UPDATE anuncios
        SET ativo = CASE
            WHEN NOW() BETWEEN data_inicio_oferta AND data_fim_oferta THEN 1
            ELSE 0
        END
    `;

    db.query(query, (error, results) => {
        if (error) throw error;
        const now = new Date();
        const formattedDateTime = now.toLocaleString('pt-BR', { 
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        console.log(`(${formattedDateTime}) Ofertas atualizadas: ${results.affectedRows}`);
    });
};

// Agendar a tarefa para rodar a cada minuto (ajuste conforme necessário)
cron.schedule('*/30 * * * *', checkAndUpdateOffers);

console.log('Tarefa de atualização de ofertas agendada.');

export { checkAndUpdateOffers }