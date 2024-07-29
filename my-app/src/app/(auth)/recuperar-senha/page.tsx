import AuthPage from '@/components/AuthPage';
import Link from 'next/link'
import { Form as RecoverPassword } from './form'

export default function EsqueciSenha() {
  return (
    <AuthPage titlepage={"Redefinir Senha"}>
          <RecoverPassword />
          <p className="text-center">
            <Link className="text-indigo-500 hover:underline" href="/login">
              Fazer Login
            </Link>{' '}
            <br />
          </p>
    </AuthPage>
  )
}