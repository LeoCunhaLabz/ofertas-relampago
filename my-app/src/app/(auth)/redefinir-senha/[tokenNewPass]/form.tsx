'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { makeRequest } from '@/../../axios';
import { Success } from '@/components/ui/success'
import React from 'react'

export const Form = ({ token }: { token: string }) => {


  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newPassword, setNewPassWord] = useState('')
  const [confirmNewPassword, setConfirmNewPassWord] = useState('')

  
  const handleRecoverPassword = (e:any) => {
    e.preventDefault();
    setError('');
    makeRequest.post(`/redefinir-senha/${token}`, {newPassword, confirmNewPassword})
    .then((res) => {
      setSuccess(res.data.message || "Email de redefinição enviado com sucesso!")
      setError(''); 
    }).catch((err)=>{
      if(err.response) {
        console.log(err.response.message);
        setError(err.response.data.message || "Ocorreu um erro desconhecido!");
        setSuccess('');
      } else {
      console.log(err)
      }
    })}

  return (
    <form className="space-y-12 sm:w-[400px]" onSubmit={(e)=>handleRecoverPassword(e)}>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="Email">Nova Senha</Label>
        <Input
          className="w-full"
          required
          value={newPassword}
          onChange={(e) => setNewPassWord(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="Email">Repetir Nova Senha</Label>
        <Input
          className="w-full"
          required
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassWord(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      {error && <Alert>{error}</Alert>}
      {success && <Success>{success}</Success>}
      <div className="w-full">
        <Button className="w-full" size="lg" onClick={(e)=>handleRecoverPassword(e)}>
          Definir Nova Senha
        </Button>
      </div>
    </form>
  )
}
