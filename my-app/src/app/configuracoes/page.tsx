// pages/settings.js
'use client'

import Image from 'next/image'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { useMutation } from '@tanstack/react-query'
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
  const [transactions, setTransactions] = useState<any[]>([]);
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
  const handleSelectAddress = (addressData: { address: any }) => {
    setFormData((prevData) => ({ ...prevData, endereco: addressData.address }))
  };

  const fetchTransactions = async () => {
    try {
      const response = await makeRequest.post('/post/gettransaction', {
        email: user?.email,
        id: user?.id,
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  };

  useEffect(() => {
    if (selectedOption === 'historico-transacoes') {
      fetchTransactions();
    }
  }, [selectedOption]);

  const getTransactionType = (type: string) => {
    switch (type) {
      case 'compra_creditos':
        return 'Compra';
      case 'postagem_anuncio':
        return 'Postagem';
      default:
        return type;
    }
  };
  
  const renderTransactionsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Tipo de Transação</th>
            <th className="py-2 px-4 border-b">Nº Créditos</th>
            <th className="py-2 px-4 border-b">Saldo</th>
            <th className="py-2 px-4 border-b">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{formatDate(transaction.data_hora_transacao)}</td>
              <td className="py-2 px-4 border-b text-center">{getTransactionType(transaction.tipo_transacao)}</td>
              <td className="py-2 px-4 border-b text-center">{transaction.num_creditos}</td>
              <td className="py-2 px-4 border-b text-center">{transaction.saldo - 1}</td>
              <td className="py-2 px-4 border-b text-right">{transaction.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

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
        cnpj: 'cnpj' in user ? user.cnpj : '',
        razaoSocial: 'razao_social' in user ? user.razao_social : '',
        nomeComercial: 'nome_comercial' in user ? user.nome_comercial : '',
        endereco: user?.endereco || '',
        cpf: 'cpf' in user ? user.cpf : '',
        nome_completo: 'nome_completo' in user ? user.nome_completo : '',
        nascimento: 'nascimento' in user ? user.nascimento : '',
        genero: 'genero' in user ? user.genero : '',
        celular: 'celular' in user ? user.celular : '',
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
      const response = await makeRequest.post('auth/updateinformation', {
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
      if ((err as any).response) {
        setError((err as any).response.data.message || 'Ocorreu um erro desconhecido!');
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
  const convertDateString = (isoStr: string) => {
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
                  <Label htmlFor="nome_completo">Nome</Label>
                  <Input
                    id="nome_completo"
                    type="text"
                    value={formData.nome_completo}
                    onChange={handleInputChange}                    
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
                  <select
                    id="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="" // Adicione a classe CSS apropriada para estilização
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    type="tel"
                    value={formData.celular}
                    onChange={handleInputChange}                    
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
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="razaoSocial">Nome/Razão Social</Label>
                  <Input
                    id="razaoSocial"
                    type="text"
                    value={formData.razaoSocial}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nomeComercial">Marca/Nome Comercial</Label>
                  <Input
                    id="nomeComercial"
                    type="text"
                    value={formData.nomeComercial}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label htmlFor="nome">Endereço</Label>
                  <AddressAutocomplete onSelectAddress={handleSelectAddress} value={undefined} />
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
        case 'historico-transacoes':
          return (
            <div>
              <h2>Histórico de Transações</h2>
              {transactions.length > 0 ? (
                renderTransactionsTable()
              ) : (
                <p>Nenhuma transação encontrada.</p>
              )}
            </div>
          );
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
            <li>
              <button
                className="w-full text-left py-2 px-4 rounded transition-colors duration-300 hover:bg-gray-300"
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </li>
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
              {userType === 'anunciante' && (
                <button
                  className={`w-full text-left py-2 px-4 rounded transition-colors duration-300 ${
                    selectedOption === 'historico-transacoes'
                      ? 'bg-gray-600 text-white font-bold'
                      : 'hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedOption('historico-transacoes')}
                >
                  Transações
                </button>
              )}
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
