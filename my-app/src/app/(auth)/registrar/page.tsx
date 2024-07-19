import AuthPage from '@/components/AuthPage';
import Link from 'next/link'
import { Form as RegisterForm } from './form'

export default function Register() {
  return (
    <AuthPage titlepage={"Registrar"}>
      <RegisterForm />
      <p className="text-center">
        <Link className="text-indigo-500 hover:underline" href="/login">
          Fazer login
        </Link>{' '}
        <br />
        <br />
        <Link className="text-indigo-500 hover:underline" href="/esqueci-senha">
          Esqueci minha senha
        </Link>{' '}
      </p>
    </AuthPage>
  )
}