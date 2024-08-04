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
        const ids = res.data.data.map((item: { id_anuncio: string }) => item.id_anuncio);
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
            href="/homepage"
            className="text-lg font-semibold rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
          >
            <Image src='/logo_oferta_relampago.png' alt='Logotipo' height={75} width={100} />
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
                  href={`/ofertas/${randomId}`}
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Surpreenda-me!
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
                  href="/ofertas"
                >
                  <span className="justify-center">Descobrir</span>
                  <svg
                    className="w-3 h-3 fill-current text-white flex ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 5H7V1H5v4H1v2h4v4h2V7h4z"
                      fillRule="nonzero"
                    />
                  </svg>
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