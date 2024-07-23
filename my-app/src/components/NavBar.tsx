import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Navbar() {
    return (
        <div className="flex max-w-full items-center justify-items-stretch rounded-2xl px-6 py-2 shadow-nav bg-red-400">
            <div className="flex grow items-center justify-center">
                <Link href="/">
                    <Image
                        src="/icone.svg"
                        alt="Icone Ofertas Relâmpago"
                        width={136}
                        height={48}
                        className="max-h-[48px]"
                    />
                </Link>
            </div>
            <Link href={"/checkout"} className="min-h-6 min-w-6 grow-0 items-center">
                <Image
                    src="/cart-outline.svg"
                    alt="Carrinho de Compras"
                    width={24}
                    height={24}
                />
            </Link>
        </div>
    )
}