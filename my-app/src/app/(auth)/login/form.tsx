'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { makeRequest } from '../../../../axios'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'

export const Form = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [userType, setUserType] = useState('cliente')
  const {setUser} = useContext(UserContext)

  const router = useRouter();

  const handleLogin = (e:any) => {
    e.preventDefault();
    setError('');
    makeRequest
    .post("auth/login", {user_type: userType, email, password})
    .then((res) => {
      localStorage.setItem("ofertas-relampago:user", JSON.stringify(res.data.user));
      localStorage.setItem("ofertas-relampago:userType", userType);
      setUser(res.data.user)
      if (userType === 'anunciante') {
        router.push('/minhas-ofertas');
      } else if (userType === 'cliente') {
        router.push('/homepage');
      }
    }).catch((err)=>{
      if(err.response) {
        console.log(err);
        setError(err.response.data.message);
      } else {
      console.log(err)
      }
    })}

  return (
    <form className="space-y-12 sm:w-[400px]" onSubmit={(e)=>handleLogin(e)}>
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
      {error && <Alert>{error}</Alert>}
      <div className="w-full">
        <Button className="w-full" size="lg" onClick={(e)=>handleLogin(e)}>
          Login
        </Button>
      </div>
    </form>
  )
}