import { db } from "../connect.js";

export const createPost = async (req, res) => {

    const { email, categoria_produto, nome_produto, endereco_loja, descricao_oferta, marca_produto, preco_original, preco_oferta, data_inicio_oferta, data_fim_oferta, imagem_url, id_anunciante } = req.body;

    // Verificar se campos foram preenchidos
    if (!id_anunciante || !categoria_produto || !nome_produto || !endereco_loja || !descricao_oferta || !marca_produto || !preco_original || !preco_oferta || !data_inicio_oferta || !data_fim_oferta || !imagem_url) {
        return res.status(400).json({ message: "Por favor, preencha todos os camposs." });
    }

    // Verificar se possuem saldo suficiente
    db.query("SELECT moedas FROM anunciantes WHERE email = ?", [email], async (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao verificar saldo." });
        }
        if (data[0].moedas < 1) {
            return res.status(400).json({ message: "Saldo insuficiente." });
        } else {
            try {

                const data_cadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');

                const newProduct = {
                    data_cadastro,
                    id_anunciante,
                    categoria_produto,
                    endereco_loja,
                    descricao_oferta,
                    marca_produto,
                    preco_original,
                    preco_oferta,
                    data_inicio_oferta,
                    data_fim_oferta,
                    imagem_url,
                    ativo: true,
                    nome_produto,
                };

                // Inserir produto
                db.query("INSERT INTO anuncios SET ?", newProduct, (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao inserir produto." });
                    } else {
                        try {
                        // Atualizar saldo
                        db.query("UPDATE anunciantes SET moedas = moedas - 40 WHERE email = ?", [email], async (error, data) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: "Erro ao atualizar saldo." });
                            } else {
                                return res.status(200).json({ message: "Produto inserido com sucesso." });
                            }
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao inserir produto. Tente novamente mais tarde." });
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao inserir produto. Tente novamente mais tarde!" });
        }
    }})}

    export const getPost = (req, res) => {
        const { email, latitude, longitude } = req.body;
        db.query(
        "SELECT p.*, u.nome_comercial, u.email FROM anuncios AS p JOIN anunciantes AS u on (p.id_anunciante = u.id) WHERE email = ? ORDER BY habilitado DESC, data_cadastro DESC", [email],
        (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao buscar posts." });
            }else {
                db.query(
                    `UPDATE anuncios AS a
                    JOIN anunciantes AS an 
                    ON a.id_anunciante = an.id
                    SET a.latitude = an.latitude, a.longitude = an.longitude
                    WHERE a.id_anunciante = an.id`,
                    (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Erro ao buscar posts." });
                        }
                        db.query(
                            `SELECT a.*, an.latitude AS anunciante_latitude, an.longitude AS anunciante_longitude,
                        (6371 * acos(cos(radians(?)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(?)) + sin(radians(?)) * sin(radians(a.latitude)))) AS distance
                        FROM anuncios AS a
                        JOIN anunciantes AS an ON a.id_anunciante = an.id
                        WHERE email = ?
                        ORDER BY a.ativo DESC, distance ASC, a.data_cadastro DESC`,
                        [latitude, longitude, latitude, email],
                        (error, data) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: "Erro ao buscar posts." });
                            }else if (data) {
                                return res.status(200).json({ data });
                            }
                        }
                    )
                }
            )
        }
    })};

    export const getRandomPost = (req, res) => {
        db.query(
        "SELECT id_anuncio FROM anuncios WHERE ativo = 1",
        (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao buscar post aleatório." });
            }else if (data) {
                return res.status(200).json({ data });
            }
    })};

    export const getUniquePost = (req, res) => {
        const { oferta_id, user_type, id_anunciante, latitude, longitude } = req.body;
        if (user_type === "anunciante") {
            db.query(
                `SELECT p.*, u.nome_comercial, u.cnpj, u.imagem_url as imagem_url_anunciante,
                (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * sin(radians(u.latitude)))) AS distance
                FROM anuncios AS p JOIN anunciantes AS u ON (p.id_anunciante = u.id) 
                WHERE id_anuncio= ? AND id_anunciante = ?`, 
                [latitude, longitude, latitude, oferta_id, id_anunciante],
                (error, data) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao buscar post." });                
                    } else if (data.length === 0) {
                        console.log(error || "Não retornou nada");
                        return res.status(404).json({ message: "Página não encontrada." });
                    } else if (data) {
                        return res.status(200).json({ data });
                    }
                }
            )
        } else if (user_type === "cliente") {
        db.query(
            `SELECT p.*, u.nome_comercial, u.cnpj, u.imagem_url as imagem_url_anunciante,
            (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * sin(radians(u.latitude)))) AS distance
            FROM anuncios AS p JOIN anunciantes AS u ON (p.id_anunciante = u.id) WHERE id_anuncio = ?`, 
            [latitude, longitude, latitude, oferta_id],
            (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao buscar informações desta oferta." });
                } else if (data) {
                    return res.status(200).json({ data });
                }
            
    })}};

    export const get6Posts = (req, res) => {
        const {} = req.body;
        db.query("SELECT * FROM anuncios WHERE ativo = 1 ORDER BY data_cadastro DESC LIMIT 6", (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao buscar posts." });
            }else if (data) {
                return res.status(200).json({ data })
            }
        });
    }

    export const getPostHomepage = (req, res) => {
        const { email, latitude, longitude } = req.body;
        db.query(
            "SELECT * FROM clientes WHERE email = ?", [email],
            (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao buscar posts." });                
                } else if (data.length === 0) {
                    console.log(error || "Não retornou nada");
                    return res.status(400).json({ message: "Usuário não é do tipo 'cliente'" });
                } else {
                    db.query(
                        `UPDATE anuncios AS a
                        JOIN anunciantes AS an 
                        ON a.id_anunciante = an.id
                        SET a.latitude = an.latitude, a.longitude = an.longitude
                        WHERE a.id_anunciante = an.id`,
                        (error) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: "Erro ao buscar posts." });
                            }
                            db.query(
                                `SELECT a.*, an.latitude AS anunciante_latitude, an.longitude AS anunciante_longitude,
                            (6371 * acos(cos(radians(?)) * cos(radians(a.latitude)) * cos(radians(a.longitude) - radians(?)) + sin(radians(?)) * sin(radians(a.latitude)))) AS distance
                            FROM anuncios AS a
                            JOIN anunciantes AS an ON a.id_anunciante = an.id
                            ORDER BY a.ativo DESC, distance ASC, a.data_cadastro DESC`,
                            [latitude, longitude, latitude],
                            (error, data) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: "Erro ao buscar posts." });
                                }else if (data) {
                                    return res.status(200).json({ data });
                                }
                            }
                        )
                    }
                )
            }
        }
    )
}

    export const getMoedas = (req, res) => {
        const { user_type, email } = req.body;
        if (user_type !== "anunciante") {
            return res.status(400).json({ message: "Usertype não está correto" });
        }
        db.query(
            "SELECT moedas FROM anunciantes WHERE email = ?", [email],
            (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao atualizar moedas." });
                }else if (data) {
                    return res.status(200).json({ data });
                }
            }
        )
    }

    export const getAllClients = (req, res) => {
        const { email } = req.body;
        if (email !== process.env.EMAIL_ADMIN) {
            return res.status(400).json({ message: "Usuário não autorizado." });
        } else if (email === process.env.EMAIL_ADMIN) {
            db.query(
                "SELECT * FROM clientes",
                (error, data) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao buscar Usuários." });
                    }else if (data) {
                        return res.status(200).json({ data });
                    }
                }
            )
        }
    }

    export const getAllAnunciantes = (req, res) => {
        const { email } = req.body;
        if (email !== process.env.EMAIL_ADMIN) {
            return res.status(400).json({ message: "Usuário não autorizado." });
        } else if (email === process.env.EMAIL_ADMIN) {
            db.query(
                "SELECT * FROM anunciantes",
                (error, data) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao buscar todos os anunciantes." });
                    }else if (data) {
                        return res.status(200).json({ data });
                    }
                }
            )
        }
    }

    export const getOneAnunciante = (req, res) => {
        const { email, id } = req.body;
        if (email !== process.env.EMAIL_ADMIN) {
            return res.status(400).json({ message: "Usuário não autorizado." });
        } else if (email === process.env.EMAIL_ADMIN) {
            db.query(
                "SELECT * FROM anunciantes WHERE id = ?", [id],
                (error, data) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao buscar unico anunciante." });
                    }else if (data) {
                        return res.status(200).json({ data });
                    }
                }
            )
        }
    }

    export const getAllPostsAnunciante = (req, res) => {
        const {email, id_anunciante, user_type} = req.body;
        if (user_type !== "anunciante") {
            return res.status(400).json({ message: "Usertype não está correto" });
        } else if (email !== process.env.EMAIL_ADMIN) {
            return res.status(400).json({ message: "Usuário não autorizado." });
        }
        db.query(
            "SELECT * FROM anuncios WHERE id_anunciante = ?", [id_anunciante],
            (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao buscar posts do anunciante." });
                }else if (data) {
                    return res.status(200).json({ data });
                }
            }
        )
    }

    export const aprovarAnunciante = (req, res) => {
        const { email, habilitado, user_type, id } = req.body;
        if (user_type !== "anunciante") {
            return res.status(400).json({ message: "Usertype não está correto" });
        } else if (email !== process.env.EMAIL_ADMIN) {
            return res.status(400).json({ message: "Usuário não autorizado." });
        }
        db.query(
            "UPDATE anunciantes SET habilitado = ?, analisado = 1 WHERE id = ?", [habilitado, id],
            (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao aprovar anunciante." });
                }else if (data) {
                    transporter.sendMail({
                        from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                        to: email,
                        subject:'Ofertas Relâmpago - Parabéns! Sua conta foi aprovada!',
                        text: `Parabéns! Seu cadastro como ANUNCIANTE foi aprovado. Agora você pode acessar o site e fazer sua primeira postagem.`, // Corpo do e-mail em texto plano
                        html: `<p>Parabéns! Seu cadastro como ANUNCIANTE foi aprovado.</p><p>Agora você pode acessar o site e fazer sua primeira postagem.</p>` // Corpo do e-mail em HTML
                    }, (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Email enviado: " + info.response);
                        }
                    });
                    return res.status(200).json({ message: "Anunciante analisado com sucesso." });
                }
            }
        )
    }