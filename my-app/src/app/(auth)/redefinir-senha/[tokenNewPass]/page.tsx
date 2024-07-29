"use client"

import AuthPage from '@/components/AuthPage';
import Link from 'next/link'
import { Form as RecoverPassword } from './form'

export default function EsqueciSenha({
  params
}: {
  params: {
    tokenNewPass: string
  }
}) {

  const token = params.tokenNewPass;

  return (
    <AuthPage titlepage={"Definir Nova Senha"}>
          <RecoverPassword token={token}/>
          <p className="text-center">
            <Link className="text-indigo-500 hover:underline" href="/login">
              Fazer Login
            </Link>{' '}
            <br />
          </p>
    </AuthPage>
  )
}