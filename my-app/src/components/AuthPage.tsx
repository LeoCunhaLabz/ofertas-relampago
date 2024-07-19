import { Header } from '@/components/Header';

export default function AuthPage({titlepage, children}: {titlepage: string, children: React.ReactNode}) {
    return (
        <section className="text-gray-800 height-full">
            <Header />
            <div className=" flex mx-0 justify-center items-center">
                <div className="max-w-screen-lg mx-auto sm:shadow-xl px-8 pb-8 pt-10 bg-white rounded-xl space-y-12">
                    <h1 className="font-semibold text-gray-600 text-2xl">{titlepage}</h1>
                    {children}
                </div>
            </div>
        </section>
    )
  }