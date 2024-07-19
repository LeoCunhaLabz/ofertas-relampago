import { NovoAnunciante } from "@/models";
import Link from "next/link";

export type AnuncianteCardProps = {
    event: NovoAnunciante;
}

export function AnunciantesCard(props: AnuncianteCardProps) {
    return (
        <Link href={`/painel-controle/${props.event.id}`}>
            <div className="flex w-[277px] flex-col rounded-2xl bg-secondary p-2">
            <img src={props.event.image_url} alt={props.event.name} />
            <div className="flex flex-col gap-y-2 px-4 py-6">
                <p className="font-semibold uppercase">{props.event.name}</p>
                <p className="text-sm lowercase textsubtitle">
                    {props.event.email}
                </p>
                <p className="text-sm font-normal">{props.event.location}</p>
            </div>
        </div>
    </Link>
    )
}