export type EventModel = {
    name: string | number | readonly string[] | undefined;
    id: string;
    id_anuncio: string;
    data_cadastro: string;
    id_anunciante: string;
    categoria_produto: string;
    descricao_oferta: string;
    nome_produto: string;
    preco_original: string;
    preco_oferta: string;
    imagem_url: string;
    data_fim_oferta: string;
    ativo: number;
    distance: number;
    analisado: number;
};

export type ClientModel = {
    id: string;
    data_cadastro: string;
    cpf: string;
    nome_completo: string;
    nascimento: string;
    genero: string;
    celular: string;
    email: string;
    habilidades: string;
    termos_uso: string;
    imagem_url: string;
    username: string;
    password: string;
    endereco: string;
}

export type AnuncianteModel = {
    id: string;
    data_cadastro: string;
    cnpj: string;
    razao_social: string;
    nome_comercial: string;
    email: string;
    endereco: string;
    moedas: string;
    habilitado: string;
    termos_uso: string;
    imagem_url: string;
    username: string;
    password: string;
    analisado: string;
}

export type NovoAnunciante = {
    id: string;
    data_cadastro: string;
    cnpj: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    image_url: string;
    categoria_produto: string;
    descricao_oferta: string;
    marca_produto: string;
    distance: number;
    nome_produto: string;
    location: string;
    id_anuncio: string;
    id_anunciante: string;
    preco_original: string; 
    preco_oferta: string;
    imagem_url: string; 
    data_fim_oferta: string;
    ativo: number;
    analisado: number;
};

export type UniqueEventModel = {
    id: null | undefined;
    id_anuncio: string;
    data_cadastro: string;
    id_anunciante: string;
    categoria_produto: string;
    endereco_loja: string;
    descricao_oferta: string;
    marca_produto: string;
    preco_original: string;
    preco_oferta: string;
    data_inicio_oferta: string;
    data_fim_oferta: string;
    imagem_url: string;
    nome_produto: string;
    ativo: number;
    nome_comercial: string;
    cnpj: string;
    imagem_url_anunciante: string;
    latitude: string;
    longitude: string;
    habilitado: string;
};