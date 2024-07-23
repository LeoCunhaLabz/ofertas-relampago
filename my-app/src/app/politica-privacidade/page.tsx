"use client"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Page() {

return (
<section className="text-gray-400 body-font">
  <Header />
  <div className="mt-12 max-w-7xl mx-auto text-center">
    <h1 className="mb-8 text-6xl Avenir font-semibold text-gray-900">
      A sua privacidade é muito importante para nós
    </h1>
    <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
      Política de Privacidade
    </h1>
    <div className="text-black text-left flex flex-col items-left justify-left mx-auto mb-10">
        <p>Bem-vindo à nossa Política de Privacidade.</p>
        <br/>
        <p>A sua privacidade é muito importante para nós. É política do <strong>Ofertas Relâmpago</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar neste site e em outros sites que possuímos e operamos.</p>
        <br/>
        <h2><strong>1. Informações que Coletamos</strong></h2>
        <p>Coletamos informações de várias formas, incluindo:</p>
        <ul>
            <li>Informações fornecidas diretamente por você;</li>
            <li>Informações coletadas automaticamente através do uso de nossos serviços;</li>
            <li>Informações de fontes de terceiros.</li>
        </ul>
        <br/>
        <h2><strong>2. Como Usamos Suas Informações</strong></h2>
        <p>Utilizamos as informações que coletamos para:</p>
        <ul>
            <li>Fornecer, operar e manter nossos serviços;</li>
            <li>Melhorar, personalizar e expandir nossos serviços;</li>
            <li>Entender e analisar como você usa nossos serviços;</li>
            <li>Desenvolver novos produtos, serviços, recursos e funcionalidades;</li>
            <li>Comunicar com você, diretamente ou através de um de nossos parceiros, incluindo para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço, e para fins de marketing e promocionais;</li>
            <li>Processar suas transações;</li>
            <li>Enviar-lhe emails;</li>
            <li>Prevenir fraudes e manter a segurança de nossos serviços.</li>
        </ul>
        <br/>
        <h2><strong>3. Compartilhamento de Informações</strong></h2>
        <p>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
        <ul>
            <li>Com provedores de serviços terceirizados para nos ajudar a operar nossos serviços;</li>
            <li>Para cumprir com obrigações legais;</li>
            <li>Para proteger e defender nossos direitos e propriedades;</li>
            <li>Com seu consentimento;</li>
            <li>Em caso de fusão, aquisição ou venda de ativos, suas informações podem ser transferidas.</li>
        </ul>
        <br/>
        <h2><strong>4. Segurança de Informações</strong></h2>
        <p>Adotamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
        <br/>
        <h2><strong>5. Seus Direitos</strong></h2>
        <p>Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Para exercer esses direitos, entre em contato conosco.</p>
        <br/>
        <h2><strong>6. Alterações a Esta Política</strong></h2>
        <p>Podemos atualizar nossa Política de Privacidade periodicamente. Recomendamos que você revise esta página regularmente para quaisquer alterações. Notificaremos sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.</p>
        <br/>
        <h2><strong>7. Contato</strong></h2>
        <p>Se você tiver qualquer dúvida sobre nossa Política de Privacidade, entre em contato conosco através do email.</p>

    </div>
  </div>
  <Footer />
</section>
    );
  }
