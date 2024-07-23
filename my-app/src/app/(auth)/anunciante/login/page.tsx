"use client"

import AuthPage from '@/components/AuthPage';
import Link from 'next/link'
import { Form as LoginForm } from './form'

export default function Login() {

  return (
    <AuthPage titlepage={"Login"}>
          <LoginForm />
          <p className="text-center">
            Ainda não está cadastrado?{' '}
            <Link className="text-indigo-500 hover:underline" href="/anunciante/registrar">
              Criar uma conta
            </Link>{' '}
            <br />
            <br />
            <Link className="text-indigo-500 hover:underline" href="/anunciante/esqueci-senha">
              Esqueci minha senha
            </Link>{' '}
          </p>
    </AuthPage>
  )
}