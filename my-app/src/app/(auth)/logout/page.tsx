import Link from 'next/link';

export default function Logout() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Até Logo!</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Logout realizado com sucesso.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Clique no botão abaixo para fazer o login novamente.</p>   
                </div>
                <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center px-6 py-3 mt-4 text-base font-medium text-white transition-all duration-300 bg-red-600 border border-transparent rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Link href="/login">
                            Voltar para Login
                        </Link>
                    </div>
                </div>   
            </div>
        </section>
    )
}
