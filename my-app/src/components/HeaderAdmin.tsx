'use client'

import React, { useEffect, useState } from 'react';
import './LPNavbar.css';
import Image from 'next/image';
import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'
import { makeRequest } from '@/../../axios';

export function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [_ids, setIds] = useState<string[]>([]);
  const [randomId, setRandomId] = useState('');
  
  useEffect(() => {
    let isMounted = true; // Adiciona uma flag para verificar se o componente está montado
    if (isMounted) { // Verifica se o componente ainda está montado antes de fazer a chamada API
      makeRequest.get("post/getpost").then((res) => {
        const ids = res.data.data.map(item => item.id_anuncio);
        setIds(ids);
        if (ids.length > 0) {
          setRandomId(ids[Math.floor(Math.random() * ids.length)]);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    return () => {
      isMounted = false; // Limpa a flag quando o componente é desmontado
    };
  }, []);

  return (
    <div className="top-0 mb-4 w-full z-30 clearNav md:bg-opacity-90 transition duration-300 ease-in-out items-center">
      <div className="flex flex-col max-w-6xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between p-4">
          <a
            href="/painel-controle"
            className="text-lg font-semibold rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
          >
            <h1 className="text-4xl Avenir tracking-tighter text-gray-900 md:text-4x1 lg:text-3xl">
              LOGO
            </h1>
          </a>
          {/* Mobile menu button */}
          <button
            className="text-white cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none "
            type="button"
            aria-label="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#191919"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div
          className={
            "md:flex flex-grow items-center" + 
            (navbarOpen ? " full-screen-sidebar open" : " full-screen-sidebar")
          }
        >
        <button
          className="exit-button md:hidden"
          onClick={() => setNavbarOpen(false)}
        >
          <Image
            src="/close-x.svg"
            width={24}
            height={24}
            alt='Close Menu Button'
            />
        </button>
          <nav className="flex-col flex-grow ">
            <ul className="flex flex-grow justify-end flex-wrap items-center mt-20 md:mt-0">
              <li>
                <a
                  href={`/painel-controle/categorias`}
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Categorias
                </a>
              </li>
              <li>
                <a
                  href={`/painel-controle/clientes`}
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Usuários
                </a>
              </li>
              <li>
                <a
                  href={`/painel-controle/anunciantes`}
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Anunciantes
                </a>
              </li>
              <li>
                <a
                  href="/configuracoes"
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Configurações
                </a>
              </li>
              <li className="md:mr-10">
                <a
                  className="inline-flex items-center px-6 py-3 mt-2 font-medium text-white transition duration-500 ease-in-out transform bg-red-500 hover:bg-red-400 rounded-lg text-lg md:mt-0 md:ml-4"
                  href="/painel-controle/aprovacoes"
                >
                  <span className="justify-center">Ver Aprovações</span>
                </a>
              </li>
{/*              <li>
                <Image src={user?.imagem_url && user?.imagem_url.length >0 ? user?.imagem_url: '/genericperson.png'} alt="Imagem de Perfil" width={48} height={48} className='hidden md:block rounded-full' />
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}