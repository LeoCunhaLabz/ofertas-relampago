'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Success } from '@/components/ui/success'
import { makeRequest } from '@/../../axios';
import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'
import React from 'react'
import CurrencyInput from 'react-currency-input-field';

export const Form = () => {

  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    categoria_produto: '',
    nome_produto: '',
    descricao_oferta: '',
    marca_produto: '',
    preco_original: '',
    preco_oferta: '',
    data_inicio_oferta:'',
    data_fim_oferta:'',
    imagem_url: '',
  })
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [img, setImg] = useState<File | null>(null);

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
    const fetchCategories = async () => {
      try {
        const response = await makeRequest.get('category/see');
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const handleRegister = async (e:any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      let updatedImageUrl = formData.imagem_url;
      if (img) {
        let uploadResult = await upload();
        uploadResult = '/uploads/' + uploadResult;
        if (uploadResult) {
          updatedImageUrl = uploadResult;
        }
      }

    const precoOriginal = formData.preco_original.replace(',', '.');
    const precoOferta = formData.preco_oferta.replace(',', '.');

    // Converte os valores para números de ponto flutuante
    const updatedFormData = {
      ...formData, 
      email: user?.email, 
      endereco_loja: user?.endereco, 
      id_anunciante: user?.id, 
      imagem_url: updatedImageUrl,
      preco_original: precoOriginal,
      preco_oferta: precoOferta
    }
    makeRequest.post("post/", updatedFormData
    ).then((res) => {
      console.log(res.data)
      setSuccess(res.data.message || "Oferta registrada com sucesso!")
      setError('');
    }).catch((err)=>{
      if(err.response) {
        console.log(err.response.message);
        setError(err.response.data.message || "Ocorreu um erro desconhecido!");
        setSuccess('');
      } else {
      console.log(err)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <form className="mt-10 space-y-12 sm:w-[400px]" onSubmit={(e)=>handleRegister(e)}>
      <div className="grid items-center gap-1.5 mt-6">
        <div className="flex items-center justify-center w-full">
            {img && <img className="rounded-lg max-h-32  object-contain" src={URL.createObjectURL(img)} alt="Imagem do post"></img>}
            {!img &&<label htmlFor="img" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 justify-center text-center"><span className="font-semibold">Clique para fazer o upload</span> ou arraste e solte</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                </div>
                <input id="img" type="file" className="hidden" onChange={(e) => e.target.files && setImg(e.target.files[0])} />
            </label>}
        </div> 
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="categoria_produto">Categoria do Produto</Label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          required
          value={formData.categoria_produto}
          onChange={handleSelectChange}
          id="categoria_produto"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="nome_produto">Nome do Produto</Label>
        <Input
          className="w-full"
          required
          value={formData.nome_produto}
          onChange={handleInputChange}
          id="nome_produto"
          type="text"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="descricao_oferta">Descrição da Oferta</Label>
        <Input
          className="w-full"
          required
          value={formData.descricao_oferta}
          onChange={handleInputChange}
          id="descricao_oferta"
          type="text"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="marca_produto">Marca do Produto</Label>
        <Input
          className="w-full"
          required
          value={formData.marca_produto}
          onChange={handleInputChange}
          id="marca_produto"
          type="text"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="preco_original">Preço Original</Label>
        <CurrencyInput
          className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900'
          required
          value={formData.preco_original}
          decimalsLimit={2}
          onValueChange={(value: string | undefined) => setFormData(prevData => ({...prevData, preco_original: value || ''}))}
          id="preco_original"
          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="preco_oferta">Preço da Oferta</Label>
        <CurrencyInput
          className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900'
          required
          value={formData.preco_oferta}
          decimalsLimit={2}
          onValueChange={(value: string | undefined) => setFormData(prevData => ({...prevData, preco_oferta: value || ''}))}
          id="preco_oferta"
          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="data_inicio_oferta">Data de Início da Oferta</Label>
        <Input
          className="w-full"
          required
          value={formData.data_inicio_oferta}
          onChange={handleInputChange}
          id="data_inicio_oferta"
          type="datetime-local"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="data_fim_oferta">Data de Fim da Oferta</Label>
        <Input
          className="w-full"
          required
          value={formData.data_fim_oferta}
          onChange={handleInputChange}
          id="data_fim_oferta"
          type="datetime-local"
        />
      </div>
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

