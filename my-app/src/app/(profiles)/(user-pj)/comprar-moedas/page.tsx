import {Header} from '@/components/HeaderPJ';
import { Package } from '@/components/Package'

export default function comprarMoedas() {
    return (
      <div>
        <Header />
        <h1 className="mt-14 text-center text-6xl max-sm:text-5xl font-bold">
          Pacotes de Moedas
        </h1>
        <div className="flex sm:space-x-4 max-sm:space-y-4 max-sm:flex-col">
            <Package
            title="Pacote Avulso"
            price="R$ 10"
            description="Experimente o poder das postagens com o Pacote Avulso!"
            features={['Compra simples e segura', 'Permite a postagem imediata da oferta!']}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-600"
            index={1}
            />
            <Package
            title="Pacote Prata"
            price="R$ 75"
            description="Amplifique as vendas da sua empresa com nosso Pacote Prata!"
            features={['10 postagens disponíveis', 'Economize 25% por postagem e aumente sua visibilidade!']}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-600"
            index={2}
            />
            <Package
            title="Pacote Ouro"
            price="R$ 500"
            description="Transforme sua empresa em uma máquina de vendas com o Pacote Ouro!"
            features={['100 postagens disponíveis', 'Economize 50% por postagem e aumente sua visibilidade!']}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-600"
            index={3}
            />
        </div>
      </div>
    );
  };