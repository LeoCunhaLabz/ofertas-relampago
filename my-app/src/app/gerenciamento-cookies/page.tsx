"use client"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Page() {

return (
<section className="text-gray-400 body-font">
  <Header />
  <div className="mt-12 max-w-7xl mx-auto text-center">
    <h1 className="mb-8 text-6xl Avenir font-semibold text-gray-900">
      Gerenciamento de Cookies
    </h1>
    <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
    O que são cookies, como os usamos, e como você pode gerenciá-los
    </h1>
    <div className="text-black text-left flex flex-col items-left justify-left mx-auto mb-10">
    <h2><strong>1. O que são Cookies?</strong></h2>
        <p>Cookies são pequenos arquivos de texto enviados para o seu navegador por um site que você visita. Eles ajudam o site a lembrar informações sobre sua visita, como seu idioma preferido e outras configurações. Isso pode tornar sua próxima visita mais fácil e o site mais útil para você.</p>
        <br/>
        <h2><strong>2. Como Usamos os Cookies?</strong></h2>
        <p>Usamos cookies para diversos fins, incluindo:</p>
        <ul>
            <li><strong>- Cookies Essenciais:</strong> Estes cookies são necessários para que o site funcione e não podem ser desativados em nossos sistemas. Eles geralmente são configurados apenas em resposta a ações feitas por você, que equivalem a uma solicitação de serviços, como configurar suas preferências de privacidade, fazer login ou preencher formulários.</li>
            <li><strong>- Cookies de Desempenho:</strong> Estes cookies nos permitem contar visitas e fontes de tráfego para que possamos medir e melhorar o desempenho do nosso site. Eles nos ajudam a saber quais são as páginas mais e menos populares e a ver como os visitantes se movimentam pelo site.</li>
            <li><strong>- Cookies de Funcionalidade:</strong> Estes cookies permitem que o site forneça uma funcionalidade e personalização aprimoradas. Eles podem ser configurados por nós ou por fornecedores terceiros cujos serviços adicionamos às nossas páginas.</li>
            <li><strong>- Cookies de Publicidade:</strong> Estes cookies podem ser configurados em nosso site por nossos parceiros de publicidade. Eles podem ser usados por essas empresas para criar um perfil dos seus interesses e mostrar-lhe anúncios relevantes em outros sites.</li>
        </ul>
        <br/>
        <h2><strong>3. Como Gerenciar Cookies?</strong></h2>
        <p>Você pode configurar seu navegador para recusar cookies ou para alertá-lo quando cookies estão sendo enviados. No entanto, se você não aceitar cookies, poderá não conseguir usar algumas partes dos nossos serviços.</p>
        <br/>
        <p>Para saber mais sobre como gerenciar cookies nos principais navegadores:</p>
        <ul>
            <li><a href="https://support.google.com/accounts/answer/61416?hl=pt-BR" target="_blank">- Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-sites-armazenam-no-computador" target="_blank">- Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank">- Internet Explorer</a></li>
            <li><a href="https://support.apple.com/pt-br/HT201265" target="_blank">- Safari</a></li>
        </ul>
        <br/>
        <h2><strong>4. Alterações a Este Gerenciamento de Cookies</strong></h2>
        <p>Podemos atualizar nossa política de gerenciamento de cookies periodicamente. Recomendamos que você revise esta página regularmente para quaisquer alterações. Notificaremos sobre quaisquer alterações publicando a nova política nesta página.</p>
        <br/>
        <h2><strong>5. Contato</strong></h2>
        <p>Se você tiver qualquer dúvida sobre nossa política de gerenciamento de cookies, entre em contato conosco através do nosso email.</p>
    </div>
  </div>
  <Footer />
</section>
    );
  }
