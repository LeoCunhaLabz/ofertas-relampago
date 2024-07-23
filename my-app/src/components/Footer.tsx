export function Footer() {
    return (
      <footer className="pb-4 mt-6">
        <div className="max-w-6xl xl:max-w-6xl mx-auto divide-y divide-gray-200 px-4 sm:px-6 md:px-8">
          <ul className="Footer_nav__2rFid text-sm font-medium sm:pb-20 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-10 gap-x-20 justify-items-center">
            <li className="space-y-5 row-span-2">
              <h2 className="text-center text-sm tracking-wide text-gray-900 uppercase font-bold">
                Empresa
              </h2>
              <ul className="text-center space-y-4 text-md">
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/como-funciona"
                  >
                    Quem Somos
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/anunciante/login"
                  >
                    Já sou anunciante
                  </a>
                </li>
              </ul>
            </li>
            <li className="space-y-5 row-span-2">
              <h2 className="text-center text-sm tracking-wide text-gray-900 uppercase font-bold">
                Descubra
              </h2>
              <ul className="text-center space-y-4">
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/registrar"
                  >
                    Cadastre-se
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/login"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/recuperar-senha"
                  >
                    Recuperar Senha
                  </a>
                </li>
              </ul>
            </li>
            <li className="space-y-5">
              <h2 className="text-center text-sm tracking-wide text-gray-900 uppercase font-bold">
                Redes Sociais
              </h2>
              <ul className="text-center space-y-4">
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    className="text-sm hover:text-gray-900 transition-colors duration-200"
                    href="/"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <div className="w-full my-12">
            <ul className="text-center flex justify-evenly w-full">
              <li>
                <a
                  href="/termos-uso"
                  className="text-sm md:text-md text-gray-700 transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/politica-privacidade"
                  className="text-sm md:text-md text-gray-700 transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="/politica-cookies"
                  className="text-sm md:text-md text-gray-700 transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
                >
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }