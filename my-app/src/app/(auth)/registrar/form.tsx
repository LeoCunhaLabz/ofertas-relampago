'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Success } from '@/components/ui/success'
import { makeRequest } from '@/../../axios';
import { AddressAutocomplete } from '@/components/AddressAutoComplete'
import React from 'react'

export const Form = () => {
  const [userType, setUserType] = useState('cliente')
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
    address: string;
    lat?: number;
    lng?: number;
  }
  
  const handleSelectAddress = (addressData: AddressData) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  return (
    <form className="space-y-12 sm:w-[400px]" onSubmit={(e)=>handleRegister(e)}>

      {userType === 'cliente' && (
        <>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              className="w-full"
              required
              value={formData.nomeCompleto}
              onChange={handleInputChange}
              id="nomeCompleto"
              type="text"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              className="w-full"
              required
              value={formData.nascimento}
              onChange={handleInputChange}
              id="nascimento"
              type="date"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="gender">Gênero</Label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              required
              value={formData.genero}
              onChange={handleInputChange}
              id="genero"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phone">Celular</Label>
            <Input
              className="w-full"
              required
              value={formData.celular}
              onChange={handleInputChange}
              id="celular"
              type="text"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="storeAddress">Endereço</Label>
            <AddressAutocomplete 
            value={formData.endereco} 
            onSelectAddress={handleSelectAddress}
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
