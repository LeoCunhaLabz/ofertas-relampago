'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { makeRequest } from '@/../../axios';
import { Success } from '@/components/ui/success'

export const Form = () => {


  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('cliente')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const handleForgotPassword = (e:any) => {
    e.preventDefault();
    setError('');
    makeRequest.post("auth/forgotpassword", {user_type: userType, email}).then((res) => {
      console.log(res.data)
      setSuccess(res.data.message || "Email enviado com sucesso!")
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
    <form className="space-y-12 sm:w-[400px]" onSubmit={(e)=>handleForgotPassword(e)}>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          className="w-full"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
        />
      </div>
      {error && <Alert>{error}</Alert>}
      {success && <Success>{success}</Success>}
      <div className="w-full">
        <Button className="w-full" size="lg" onClick={(e)=>handleForgotPassword(e)}>
          Redefinir Senha
        </Button>
      </div>
    </form>
  )
}
