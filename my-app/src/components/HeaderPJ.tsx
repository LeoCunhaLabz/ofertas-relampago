'use client'

import React, { useEffect, useState, useContext } from 'react';
import './LPNavbar.css';
import Image from 'next/image';
import { UserContext } from '@/context/UserContext';
import { makeRequest } from '@/../../axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [anunciante, setAnunciante] = useState({ username: '', img: '', imagem_url: '' });
  const { user, setUser } = useContext(UserContext);
  const userType = 'anunciante';
  const email = user?.email;

  useEffect(() => {
    if (email && userType) {
      makeRequest.post("post/getmoedas", { user_type: userType, email }).then((res) => {
        const newValue = res.data.data[0]?.moedas;
        let storedUser = localStorage.getItem("ofertas-relampago:user");
        if (storedUser) {
          try {
            let userObj = JSON.parse(storedUser);
            userObj.moedas = newValue;
            localStorage.setItem("ofertas-relampago:user", JSON.stringify(userObj));
            setAnunciante(userObj);
          } catch (error) {
            console.error("Erro ao fazer parse do objeto de usuário", error);
          }
        }
      });
    }
  }, [userType, email]);

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      return await makeRequest.post('auth/logout');
    },
    onSuccess: () => {
      setUser({ username: '', img: '', imagem_url: '' });
      localStorage.removeItem("ofertas-relampago:user");
      localStorage.removeItem("ofertas-relampago:userType");
      router.push("/logout");
    },
  });

  return (
    <div className="top-0 mb-4 w-full z-30 clearNav md:bg-opacity-90 transition duration-300 ease-in-out items-center">
      <div className="flex flex-col max-w-6xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between p-4">
          <a
            href="/minhas-ofertas"
            className="text-lg font-semibold rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
          >
            <Image src='/logo_oferta_relampago.png' alt='Logotipo' height={75} width={100} />
          </a>
          <button
            className="text-white cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none"
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
          <nav className="flex-col flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center mt-20 md:mt-0">
              <li>
                <a href="/comprar-creditos">
                  <div
                    className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                  >
                    <Image
                      src="/saldo.svg"
                      width={24}
                      height={24}
                      alt='Saldo'
                      className="mr-2"
                    />
                    <span className='text-red-500 font-bold mr-1'>{user?.moedas}</span>créditos
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="/configuracoes"
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Perfil
                </a>
              </li>
              <li className="md:mr-10">
                <a
                  className="inline-flex items-center px-6 py-3 mt-2 font-medium text-white transition duration-500 ease-in-out transform bg-red-500 hover:bg-red-400 rounded-lg text-lg md:mt-0 md:ml-4"
                  href="/minhas-ofertas/nova-oferta"
                >
                  <span className="justify-center">Nova Oferta</span>
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
              <li>
                <button
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                  onClick={() => mutation.mutate()}
                >
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}