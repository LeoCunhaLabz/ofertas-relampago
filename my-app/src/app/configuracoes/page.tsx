// pages/settings.js
'use client'

import Image from 'next/image'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { useMutation, useQuery } from '@tanstack/react-query'
import { makeRequest } from '@/../../axios';
import { UserContext } from '@/context/UserContext'
import { Success } from '@/components/ui/success'
import { Title } from '@/components/Title'
import { AddressAutocomplete } from '@/components/AddressAutoComplete'


const Settings = () => {
  const {user, setUser} = useContext(UserContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('alterar-informacoes')
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [formData, setFormData] = useState({
    imagemUrl: '',
    email: user?.email,
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    representativeName: '',
    representativeEmail: '',
    // Campos adicionais para Anunciante
    cnpj: '',
    razaoSocial: '',
    nomeComercial: '',
    endereco: '',
    // Campos adicionais para Cliente
    cpf: '',
    nome_completo: '',
    nascimento: '',
    genero: '',
    celular: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const [userType, setUserType] = useState('')
  const [img, setImg] = useState<File | null>(null);
  const handleSelectAddress = (addressData) => {
    setFormData((prevData) => ({ ...prevData, endereco: addressData.address }))
  };

  const upload = async () => {
    try {
      const formData2 = new FormData();
      img && formData2.append('file', img);
      const res = await makeRequest.post('upload/', formData2)
      console.log (res.data)
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        imagemUrl: user?.imagem_url ,
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        representativeName: '',
        representativeEmail: '',
        cnpj: user?.cnpj || '',
        razaoSocial: user?.razao_social || '',
        nomeComercial: user?.nome_comercial || '',
        endereco: user?.endereco || '',
        cpf: user?.cpf || '',
        nome_completo: user?.nome_completo || '',
        nascimento: user?.nascimento || '',
        genero: user?.genero || '',
        celular: user?.celular || '',
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      const userType = localStorage.getItem("ofertas-relampago:userType");
      setUserType(userType?.toString() || '');
    }
  },[user])
  
  const mutation = useMutation({
    mutationFn: async () => {
      return await makeRequest.post('auth/logout').then((res) => {
        res.data;
      });
    },
    onSuccess: () => {
      setUser(undefined);
      localStorage.removeItem("ofertas-relampago:user");
      localStorage.removeItem("ofertas-relampago:userType");
      router.push("/logout");
    },
  })

  const handleInputChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let updatedImageUrl = formData.imagemUrl;
      if (img) {
        let uploadResult = await upload();
        uploadResult = '/uploads/' + uploadResult;
        if (uploadResult) {
          updatedImageUrl = uploadResult;
        }
      }
      const response = await makeRequest.post('auth/updateinformation', {
        imagem_url: updatedImageUrl,
        user_type: userType, 
        email: formData.email, 
        password: formData.password, 
        confirm_password: formData.confirmPassword, 
        cnpj: formData.cnpj, 
        razao_social: formData.razaoSocial, 
        nome_comercial: formData.nomeComercial,
        endereco: formData.endereco, 
        cpf: formData.cpf, 
        nome_completo: formData.nome_completo, 
        nascimento: formData.nascimento, 
        genero: formData.genero, 
        celular: formData.celular
      });
  
      // Atualiza o contexto do usuário
      const updatedUser = response.data.data[0];
      setUser(updatedUser);
  
      // Atualiza o localStorage
      localStorage.setItem("ofertas-relampago:user", JSON.stringify(updatedUser));
      setImg(null);
  
      // Define a mensagem de sucesso
      setSuccess(response.data.message || 'Informações atualizadas com sucesso!');
    } catch (err) {
      // Trata erros de resposta do servidor
      if (err.response) {
        setError(err.response.data.message || 'Ocorreu um erro desconhecido!');
      } else {
        console.log(err);
        setError('Ocorreu um erro ao tentar atualizar as informações!');
      }
    }
  }

  const onSubmitPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    makeRequest
    .post('auth/updatepassword', {user_type: userType, email: formData.email, password: formData.password, newPassword: formData.newPassword, confirmNewPassword: formData.confirmNewPassword})
    .then((res) => {
      console.log(res.data)
      setSuccess(res.data.message || 'Senha atualizada com sucesso!')
      setError('');
    }).catch((err)=>{
      if(err.response) {
        console.log(err.response.message);
        setError(err.response.data.message || 'Ocorreu um erro desconhecido!');
        setSuccess('');
      } else {
      console.log(err)
      }
    }
  )
  }

  // Supondo que formData.nascimento seja uma string no formato "DD/MM/YYYY"
  const convertDateString = (isoStr) => {
  // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
  return isoStr.split('T')[0];
};

  const renderForm = () => {
    switch (selectedOption) {
      case 'alterar-informacoes':
        return (
          <form onSubmit={onSubmit} className="space-y-6">
            {userType === 'cliente' ? (
              <>
{/*                <div className="grid items-center gap-1.5 mt-6">
                  <div class="flex items-center justify-center w-full">
                      {img && <img className="rounded-lg max-h-32  object-contain" src={URL.createObjectURL(img)} alt="Imagem do post"></img>}
                      {!img &&<label for="img" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 justify-center text-center"><span className="font-semibold">Clique para fazer o upload da sua foto</span> ou arraste e solte</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                          </div>
                          <input id="img" type="file" class="hidden" onChange={(e) => e.target.files && setImg(e.target.files[0])} />
                      </label>
                  </div> 
                </div> */}
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder={user?.cpf}
                    
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nome_completo">Nome</Label>
                  <Input
                    id="nome_completo"
                    type="text"
                    value={formData.nome_completo}
                    onChange={handleInputChange}
                    placeholder={user?.nome_completo}
                    
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nome">Endereço</Label>
                  <AddressAutocomplete
                  value = {formData.endereco}
                  onSelectAddress={handleSelectAddress}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nascimento">Data de Nascimento</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={convertDateString(formData.nascimento)}
                    onChange={handleInputChange}
                    
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="genero">Gênero</Label>
                  <Input
                    id="genero"
                    type="text"
                    value={formData.genero}
                    onChange={handleInputChange}
                    placeholder={user?.genero}
                    
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    type="tel"
                    value={formData.celular}
                    onChange={handleInputChange}
                    placeholder={user?.celular}
                    
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
{/*                <div className="grid items-center gap-1.5 mt-6">
                  <div class="flex items-center justify-center w-full">
                      {img && <img className="rounded-lg max-h-32  object-contain" src={URL.createObjectURL(img)} alt="Imagem do post"></img>}
                      {!img &&<label for="img" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 justify-center text-center"><span className="font-semibold">Clique para fazer o upload</span> ou arraste e solte</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                          </div>
                          <input id="img" type="file" class="hidden" onChange={(e) => e.target.files && setImg(e.target.files[0])} />
                      </label>}
                  </div> 
                </div> */}
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    type="text"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder={user?.cnpj}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="razaoSocial">Nome/Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    type="text"
                    value={formData.razaoSocial}
                    onChange={handleInputChange}
                    placeholder={user?.razao_social}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nomeComercial">Marca/Nome Comercial</Label>
                  <Input
                    id="nomeComercial"
                    type="text"
                    value={formData.nomeComercial}
                    onChange={handleInputChange}
                    placeholder={user?.nome_comercial}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nome">Endereço</Label>
                  <AddressAutocomplete onSelectAddress={handleSelectAddress} />
                </div> 
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            {error && <Alert>{error}</Alert>}
            {success && <Success>{success}</Success>}
            <Button type="submit" size="lg" className="w-full">
              Atualizar
            </Button>
          </form>
        )
      case 'alterar-senha':
        return (
          <form onSubmit={onSubmitPassword} className="space-y-6">
            <Title>Confirme as informações a seguir</Title>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="password">Senha Atual</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && <Alert>{error}</Alert>}
            {success && <Success>{success}</Success>}

            <Button type="submit" size="lg" className="w-full">
              Atualizar Senha
            </Button>
          </form>
        )
        case 'alterar-informacoes':
          return <div>Alterar Informações</div>      
        case 'historico-transacoes':
        return <div>Histórico de Transações (Em construção)</div>
      case 'sair-conta':
        return <div>
        <Button type="submit" size="lg" className="w-full" onClick={() => mutation.mutate()}>
        Sair da Conta
        </Button>
        </div>
      default:
        return null
    }
  }

  return (
    <div className="flex h-full min-h-screen">
      <button
        className="block sm:hidden fixed bottom-4 right-4 z-50 p-2 bg-gray-200 text-white rounded-full border-2 border-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
              <Image
              src="/close-x.svg"
              width={32}
              height={32}
              alt='Fechar Menu'
              />
          ) : (
            <Image
            src="/engrenagem.svg"
            width={32}
            height={32}
            alt='Abrir Menu'
            />
          )}
        </button>
      <aside className={`fixed inset-0 z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 transition-transform duration-300 ease-in-out sm:block sm:w-1/4 p-4 bg-white text-gray-800`}>
        <nav>
          <ul className="space-y-4 mb-4">
{/*            <li>
              <Image src={user?.imagem_url && user?.imagem_url.length >0? user?.imagem_url: '/genericperson.png'} alt="Imagem de Perfil" width={200} height={48} className='max-h-32 object-contain my-4' />
            </li> */}
            <li>
              <button
                className={`w-full text-left py-2 px-4 rounded transition-colors duration-300 ${
                  selectedOption === 'alterar-informacoes'
                    ? 'bg-gray-600 text-white font-bold'
                    : 'hover:bg-gray-300'
                }`}
                onClick={() => setSelectedOption('alterar-informacoes')}
              >
                Alterar Informações
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-2 px-4 rounded transition-colors duration-300 ${
                  selectedOption === 'alterar-senha'
                    ? 'bg-gray-600 text-white font-bold'
                    : 'hover:bg-gray-300'
                }`}
                onClick={() => setSelectedOption('alterar-senha')}
              >
                Alterar Senha
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-2 px-4 rounded transition-colors duration-300 ${
                  selectedOption === 'sair-conta'
                    ? 'bg-gray-600 text-white font-bold'
                    : 'hover:bg-gray-300'
                }`}
                onClick={() => setSelectedOption('sair-conta')}
              >
                Sair da Conta
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 bg-white">
        {renderForm()}
      </main>
    </div>
  )
}

export default Settings;
