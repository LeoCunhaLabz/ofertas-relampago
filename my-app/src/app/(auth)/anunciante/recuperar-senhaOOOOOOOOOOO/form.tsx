'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { makeRequest } from '../../../../../axios'
import { Success } from '@/components/ui/success'

export const Form = () => {


  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const handleRecoverPassword = (e:any) => {
    e.preventDefault();
    setError('');
    makeRequest.post("auth/resetpassword", {password, confirmPassword}).then((res) => {
      console.log(res.data)
      setSuccess(res.data.message || "Senha redefinida com sucesso!")
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
        <Label htmlFor="password">Senha</Label>
        <Input
          className="w-full"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          className="w-full"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="confirmPassword"
          type="password"
        />
      </div>
      {error && <Alert>{error}</Alert>}
      {success && <Success>{success}</Success>}
      <div className="w-full">
        <Button className="w-full" size="lg" onClick={(e)=>handleRecoverPassword(e)}>
          Redefinir Senha
        </Button>
      </div>
    </form>
  )
}
