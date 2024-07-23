import {Header} from '@/components/HeaderPJ';
import { Package } from '@/components/Package'

export default function comprarMoedas() {
    return (
      <div>
        <Header />
        <h1 className="mt-14 text-center text-6xl max-sm:text-5xl font-bold">
          Pacotes de Anúncios
        </h1>
        <div className="flex sm:space-x-4 max-sm:space-y-4 max-sm:flex-col">
            <Package
            title="Anúncio Avulso"
            price="R$ 5"
            description="Experimente o poder das postagens com o Pacote Avulso!"
            features={['Compra simples e segura', 'Permite a postagem imediata da oferta!']}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-600"
            index={1}
            />
            <Package
            title="Pacote 10 Anúncios"
            price="R$ 40"
            description="Amplifique as vendas da sua empresa com nosso Pacote 10!"
            features={['10 postagens disponíveis', 'Economize 20% por postagem e aumente sua visibilidade!']}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-600"
            index={2}
            />
            <Package
            title="Pacote 50 Anúncios"
            price="R$ 150"
            description="Transforme sua empresa em uma máquina de vendas com o Pacote 50!"
            features={['100 postagens disponíveis', 'Economize 40% por postagem e aumente sua visibilidade!']}
            bgColor="bg-blue-50"
            hoverColor="hover:bg-blue-600"
            index={3}
            />
        </div>
      </div>
    );
  };