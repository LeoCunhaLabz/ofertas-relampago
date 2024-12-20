'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Success } from '@/components/ui/success'
import { makeRequest } from '@/../../axios'
import { AddressAutocomplete } from '@/components/AddressAutoComplete'
import { useRouter } from 'next/router'

export const Form = () => {
  const [userType, setUserType] = useState('anunciante')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    cnpj: '',
    razaoSocial: '',
    nomeComercial: '',
    endereco: '',
    cpf: '',
    nomeCompleto: '',
    nascimento: '',
    genero: '',
    celular: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  interface AddressData {
    address: string
  }
  const handleSelectAddress = (addressData:AddressData) => {
  setFormData((prevData) => ({ ...prevData, endereco: addressData.address }))
};

  const handleRegister = (e:any) => {
    e.preventDefault();
    setError('');
    const { username, email, password, confirmPassword, cnpj, razaoSocial, nomeComercial, endereco, cpf, nomeCompleto, nascimento, genero, celular } = formData;
    makeRequest.post("auth/register", {
      user_type: userType,
      username, 
      email, 
      password, 
      confirmPassword, 
      cnpj, 
      razao_social: razaoSocial,
      nome_comercial: nomeComercial,
      endereco, 
      cpf, 
      nome_completo: nomeCompleto, 
      nascimento, 
      genero, 
      celular,
    }).then((res) => {
      console.log(res.data)
      setSuccess(res.data.message || "Usuário registrado com sucesso!")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  return (
    <form className="space-y-12 sm:w-[400px]" onSubmit={(e)=>handleRegister(e)}>
      {userType === 'anunciante' && (
        <>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              className="w-full"
              required
              value={formData.cnpj}
              onChange={handleInputChange}
              id="cnpj"
              type="text"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="companyName">Nome da empresa ou Razão Social</Label>
            <Input
              className="w-full"
              required
              value={formData.razaoSocial}
              onChange={handleInputChange}
              id="razaoSocial"
              type="text"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="tradeName">Marca ou Nome Comercial</Label>
            <Input
              className="w-full"
              required
              value={formData.nomeComercial}
              onChange={handleInputChange}
              id="nomeComercial"
              type="text"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="companyEmail">Email da empresa</Label>
            <Input
              className="w-full"
              required
              value={formData.email}
              onChange={handleInputChange}
              id="email"
              type="email"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              className="w-full"
              required
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              type="password"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              className="w-full"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              id="confirmPassword"
              type="password"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="storeAddress">Endereço da Loja</Label>
            <AddressAutocomplete value={formData.endereco} onSelectAddress={handleSelectAddress} />
          </div>
        </>
      )}
      {error && <Alert>{error}</Alert>}
      {success && <Success>{success}</Success>}
      <div className="w-full">
        <Button className="w-full" size="lg" onClick={(e)=>handleRegister(e)}>
          Registrar
        </Button>
      </div>
    </form>
  )
}
