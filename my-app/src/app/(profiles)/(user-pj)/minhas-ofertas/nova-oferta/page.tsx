import { Form as NewOfferForm } from './form';
import { Header } from '@/components/HeaderPJ';
import NewProductPage from '@/components/NewProductPage';



export default function Register() {
  return (
    <main className='w-full mt-0'>
      <Header />
      <NewProductPage titlepage={"Cadastrar Novo Produto"}>
        <NewOfferForm />
      </NewProductPage>
    </main>
    )
}