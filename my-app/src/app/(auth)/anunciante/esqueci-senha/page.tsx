import AuthPage from '@/components/AuthPage';
import Link from 'next/link'
import { Form as ForgotPassword } from './form'

export default function EsqueciSenha() {
  return (
    <AuthPage titlepage={"Recuperar Senha"}>
          <ForgotPassword />
          <p className="text-center">
            <Link className="text-indigo-500 hover:underline" href="/anunciante/login">
              Fazer Login
            </Link>{' '}
            <br />
          </p>
    </AuthPage>
  )
}