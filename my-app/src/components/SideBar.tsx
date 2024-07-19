import { useState } from 'react';
import Image from 'next/image';

export default function Sidebar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        </ul>
      </nav>
    </aside>
  </div>
  )
}
