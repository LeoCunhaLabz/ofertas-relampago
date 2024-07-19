import { Title } from "@/components/Title";

interface EventModel {
    id: string;
    name: string;
    organization: string;
    date: string;
    location: string;
    quantity: string;
    price: string;
}

export default function CheckoutPagePF() {
    const event: EventModel = {
        id: "1",
        name: "Carne Moída",
        organization: "Extra Super Mercado",
        date: "2022-12-31T00:00:00.000Z",
        location: "São Paulo",
        quantity: "1", 
        price: "100,00",
    };
    return (
        <main className="mt-10 flex flex-wrap justify-center md:justify-between">
            <div className="mb-4 flex max-h-[300px] w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary p-4">
                <Title>Resumo da Compra</Title>
                <p className="mb-3">
                    Produto: {event.name}
                    <br />
                    <br />
                    Quantidade: {event.quantity}
                    <br />
                    <br />
                    Mercado: {event.organization}
                    <br />
                </p>
                <p className="font-semibold text-2xl">
                    Preço Total: R$ {event.price}
                </p>
            </div>
            <div className="w-full max-w-[650px] rounded-2xl bg-secondary p-4">
                <Title className="mb-6">Informações de Pagamento</Title>
                <div className="flex flex-col">
                    <label htmlFor="titular">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        className="mb-6 border-solid rounded p-2 h-10 bg-input"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="titular">Nome no Cartão</label>
                    <input
                        type="text"
                        name="card_name"
                        className="mb-6 border-solid rounded p-2 h-10 bg-input"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="cc">Número do Cartão</label>
                    <input
                        type="text"
                        name="card_no"
                        className="mb-6 border-solid rounded p-2 h-10 bg-input"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="expire">Vencimento</label>
                    <input
                        type="text"
                        name="expire_date"
                        className="mb-6 border-solid rounded p-2 h-10 bg-input"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="cvv">CVV</label>
                    <input
                        type="text"
                        name="cvv"
                        className="mb-6 border-solid rounded p-2 h-10 bg-input"
                    />
                </div>
                <button className="mt-2 rounded-lg bg-green-400 py-4 px-4 text-sm font-semibold uppercase mb-4">
                Finalizar Pagamento
                </button>
            </div>
        </main>
    )
}