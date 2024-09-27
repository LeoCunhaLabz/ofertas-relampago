import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let user_type = "anunciante";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,  
    port:process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    dkim: {
        domainName: 'ofertarelampago.app.br',
        keySelector: 'mail',
        privateKey: process.env.DKIM_PRIVATE_KEY
    }
})

async function geocodeAddress(address) {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
    } else {
        throw new Error("Erro ao obter as coordenadas do endereço.");
    }
}

// Função para registrar um novo usuário
export const register = (req, res) => {

    const { user_type, username, email, password, confirmPassword, cnpj, razao_social, nome_comercial, endereco, cpf, nome_completo, nascimento, genero, celular } = req.body;

    if (user_type == "anunciante") {

        // Verificar se os campos obrigatórios foram preenchidos
        if (!endereco) {
            return res.status(400).json({ message: "O endereço fornecido não foi reconhecido pelo Google Maps. Por favor, reescreva o endereço." });
        }

        if (!email || !password || !confirmPassword || !cnpj || !razao_social || !nome_comercial) {
            return res.status(400).json({ message: "Por favor, preencha todos os campos." });
        }

        // Verificar se as senhas coincidem
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "As senhas não coincidem." });
        }

        // Verificar se o email já está em uso
        db.query("SELECT email FROM anunciantes WHERE email = ?", [email], async (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao verificar o email." });
            }
            if (data.length > 0) {
                return res.status(400).json({ message: "Este email já está em uso." });
            } else {
                try {
                    // Hash da senha
                    const passwordHash = await bcrypt.hash(password, 8);

                    // Obter a data atual
                    const data_cadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    const { lat, lng } = await geocodeAddress(endereco);

                    // Dados a serem inseridos
                    const newAnunciante = {
                        username,
                        password: passwordHash,
                        data_cadastro,
                        cnpj,
                        razao_social,
                        nome_comercial,
                        email,
                        endereco,
                        latitude: lat,
                        longitude: lng,
                        moedas: 0,
                        habilitado: false,
                        termos_uso: false,
                    };

                    // Inserir novo anunciante na base de dados
                    db.query("INSERT INTO anunciantes SET ?", newAnunciante, (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Erro ao registrar o usuário." });
                        } else {
                            transporter.sendMail({
                                from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                                to: process.env.EMAIL_ADMIN,
                                subject:'Ofertas Relâmpago - Novo Anunciante cadastrado',
                                text: `Um novo ANUNCIANTE foi cadastrado com as seguintes informações:\nNome Comercial: ${nome_comercial}\nCNPJ: ${cnpj}\nRazão Social: ${razao_social}\nE-mail: ${email}\nEndereço: ${endereco}`, // Corpo do e-mail em texto plano
                                html: `<p>Um novo ANUNCIANTE foi cadastrado com as seguintes informações:</p>
                                       <ul>
                                         <li>Nome Comercial: ${nome_comercial}</li>
                                         <li>CNPJ: ${cnpj}</li>
                                         <li>Razão Social: ${razao_social}</li>
                                         <li>E-mail: ${email}</li>
                                         <li>Endereço: ${endereco}</li>
                                       </ul>
                                       <p>Acesse o Painel de Administrador para Aprovar o usuário</p>` // Corpo do e-mail em HTML
                            }, (error, info) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Email enviado a administrador: " + info.response);
                                }
                            })
                            
                            const confirmToken = jwt.sign({ email }, process.env.TOKEN);
                            const confirmUrl = `http://ofertarelampago.app.br/confirmar-email-anunciante/${confirmToken}`;

                            transporter.sendMail({
                                from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                                to: email,
                                subject: 'Confirmação de Email',
                                text: `Por favor, clique no seguinte link para confirmar seu email: ${confirmUrl}`,
                                html: `<p>Por favor, clique no seguinte link para confirmar seu email:</p><a href="${confirmUrl}">Confirmar Email</a>`,
                            }, (error, info) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: "Erro ao enviar email de confirmação." });
                                } else {
                                    return res.status(201).json({ message: "Usuário registrado com sucesso. Por favor, verifique seu email para confirmar a conta." });
                                }
                            });
                            
                            ;
                            return res.status(201).json({ message: "Usuário registrado com sucesso. Por favor, verifique seu email para confirmar a conta." });
                        }
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao registrar o usuário." });
                }
            }
        });
    } else if (user_type == "cliente") {

        if (!endereco) {
            return res.status(400).json({ message: "O endereço fornecido não foi reconhecido pelo Google Maps. Por favor, reescreva o endereço." });
        }

        // Verificar se os campos obrigatórios foram preenchidos
        if (!email || !password || !confirmPassword || !nome_completo || !nascimento || !genero || !celular) {
            return res.status(400).json({ message: "Por favor, preencha todos os campos." });
        }

        // Verificar se as senhas coincidem
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "As senhas não coincidem." });
        }

        // Verificar se o email já está em uso
        db.query("SELECT email FROM clientes WHERE email = ?", [email], async (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao verificar o email." });
            }
            if (data.length > 0) {
                return res.status(400).json({ message: "Este email já está em uso." });
            } else {
                try {
                    // Hash da senha
                    const passwordHash = await bcrypt.hash(password, 8);

                    // Obter a data atual
                    const data_cadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    const { lat, lng } = await geocodeAddress(endereco);

                    // Dados a serem inseridos
                    const newCliente = {
                        username,
                        password: passwordHash,
                        data_cadastro,
                        cpf,
                        nome_completo,
                        nascimento,
                        genero,
                        celular,
                        endereco,
                        email,
                        latitude: lat,
                        longitude: lng,
                        habilitado: false,
                        termos_uso: false,
                    };

                    // Inserir novo cliente na base de dados
                    db.query("INSERT INTO clientes SET ?", newCliente, (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Erro ao registrar o usuário." });
                        } else {
                            transporter.sendMail({
                                from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                                to: process.env.EMAIL_ADMIN,
                                subject:'Ofertas Relâmpago - Novo Usuário cadastrado',
                                text: `Um novo USUÁRIO foi cadastrado com as seguintes informações:\nNome Comercial: ${nome_comercial}\nCNPJ: ${cnpj}\nRazão Social: ${razao_social}\nE-mail: ${email}\nEndereço: ${endereco}`, // Corpo do e-mail em texto plano
                                html: `<p>Um novo USUÁRIO foi cadastrado com as seguintes informações:</p>
                                       <ul>
                                         <li>Nome Completo: ${nome_completo}</li>
                                         <li>Data de Nascimento: ${nascimento}</li>
                                         <li>Gênero: ${genero}</li>
                                         <li>Celular: ${celular}</li>
                                         <li>Endereço: ${endereco}</li>
                                         <li>E-mail: ${email}</li>
                                       </ul>` // Corpo do e-mail em HTML
                            }, (error, info) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Email enviado: " + info.response);
                                }
                            });

                            const confirmToken = jwt.sign({ email }, process.env.TOKEN);
                            const confirmUrl = `http://ofertarelampago.app.br/confirmar-email-usuario/${confirmToken}`;

                            transporter.sendMail({
                                from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                                to: email,
                                subject: 'Confirmação de Email',
                                text: `Por favor, clique no seguinte link para confirmar seu email: ${confirmUrl}`,
                                html: `<p>Por favor, clique no seguinte link para confirmar seu email:</p><a href="${confirmUrl}">Confirmar Email</a>`,
                            }, (error, info) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: "Erro ao enviar email de confirmação." });
                                } else {
                                    return res.status(201).json({ message: "Usuário registrado com sucesso. Por favor, verifique seu email para confirmar a conta." });
                                }
                            });

                            return res.status(201).json({ message: "Usuário registrado com sucesso." });
                        }
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao registrar o usuário." });
                }
            }
        });
    }
};

export const login = (req, res) => {
    const { user_type, email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }

    if (user_type == "anunciante") {
        db.query(
            "SELECT * FROM anunciantes WHERE email = ?", 
            [email], 
            async (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao fazer login." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];

                    const checkPassword = await bcrypt.compare(password, user.password);

                    if (!checkPassword) {
                        return res.status(422).json({ message: "Senha incorreta." });
                    }

                    // Verificação de confirmação de email
                    if (!user.email_confirm) {
                        return res.status(403).json({ message: "Email não confirmado." });
                    }

                    
                    if (user.habilitado === 0) {
                        return res.status(403).json({ message: "Usuário ainda não está habilitado." });
                    }

                    try {
                        const refreshToken = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                            id: user.password
                        },
                        process.env.REFRESH,
                        { algorithm: 'HS256' }
                        );
                        const token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 60 * 60,
                            id: user.password
                        },
                        process.env.TOKEN,
                        { algorithm: 'HS256' }
                        );
                        delete user.password;
                        res.cookie("accessToken", token,{httpOnly:true, secure: true, sameSite: "none"})
                        .cookie("refreshToken", refreshToken,{httpOnly:true, secure: true, sameSite: "none"})
                        .status(200).json({ 
                            msg:"Usuário logado com sucesso", 
                            user
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ msg: "Erro ao fazer login!" });
                    }
                }
            }
        )         
    }
    else if (user_type == "cliente") {
        db.query(
            "SELECT * FROM clientes WHERE email = ?", 
            [email], 
            async (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao fazer login." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];

                    const checkPassword = await bcrypt.compare(password, user.password);

                    if (!checkPassword) {
                        return res.status(422).json({ message: "Senha incorreta." });
                    }

                    // Verificação de confirmação de email
                    if (!user.email_confirm) {
                        return res.status(403).json({ message: "Email não confirmado." });
                    }

                    try {
                        const refreshToken = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                            id: user.password
                        },
                        process.env.REFRESH,
                        { algorithm: 'HS256' }
                        );
                        const token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 60 * 60,
                            id: user.password
                        },
                        process.env.TOKEN,
                        { algorithm: 'HS256' }
                        );
                        delete user.password;
                        res.cookie("accessToken", token,{httpOnly:true, secure: true, sameSite: "none"})
                        .cookie("refreshToken", refreshToken,{httpOnly:true, secure: true, sameSite: "none"})
                        .status(200).json({ 
                            msg:"Usuário logado com sucesso", 
                            user
                        })
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ msg: "Erro ao fazer login!" });
                    }
                }
            }
        )         
    };
}

export const esqueciSenha = (req, res) => {
    const { user_type, email } = req.body;

    if (!email || !user_type) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos corretamente." });
    }

    if (user_type == "anunciante") {
        db.query(
            "SELECT * FROM anunciantes WHERE email = ?", 
            [email], 
            async (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao recuperar senha." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];
                    const resetToken = jwt.sign(
                        {id: user.id, email: user.email, user_type: "anunciante" },
                        process.env.TOKEN,
                        { expiresIn: "1h" }
                    );
                    
                    transporter.sendMail({
                        from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                        to: email,
                        subject: 'Redefinição de Senha',
                        text: `Você solicitou a redefinição de senha. Por favor, clique no seguinte link, ou cole-o no seu navegador para completar o processo: http://ofertarelampago.app.br/redefinir-senha/${resetToken}`,
                        html: `<p>Você solicitou a redefinição de senha.</p><p>Por favor, clique no seguinte link, ou cole-o no seu navegador para completar o processo:</p><a href="http://ofertarelampago.app.br/redefinir-senha/${resetToken}">Redefinir Senha</a>`
                    },
                    (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Erro ao enviar email de recuperação." });
                        } else {
                    return res.status(200).json({ message: "Email de recuperação enviado com sucesso!" });
                }
            })     
    }})
    } else if (user_type == "cliente") {
        db.query(
            "SELECT * FROM clientes WHERE email = ?", 
            [email], 
            async (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao recuperar senha." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];
                    const resetToken = jwt.sign(
                        {id: user.id, email: user.email, user_type: "cliente" },
                        process.env.TOKEN,
                        { expiresIn: "1h" }
                    );
                    
                    transporter.sendMail({
                        from: 'Ofertas Relampago <contato@ofertarelampago.app.br>',
                        to: email,
                        subject: 'Redefinição de Senha',
                        text: `Você solicitou a redefinição de senha. Por favor, clique no seguinte link, ou cole-o no seu navegador para completar o processo: http://ofertarelampago.app.br/redefinir-senha/${resetToken}`,
                        html: `<p>Você solicitou a redefinição de senha.</p><p>Por favor, clique no seguinte link, ou cole-o no seu navegador para completar o processo:</p><a href="http://ofertarelampago.app.br/redefinir-senha/${resetToken}">Redefinir Senha</a>`
                    },
                    (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Erro ao enviar email de recuperação." });
                        } else {
                    return res.status(200).json({ message: "Email de recuperação enviado com sucesso!" });
                }
            })     
    }})
    };
}

export const refresh = (req, res) => {
    const cookies = req.headers.cookie?.split("; ");
    const authHeader = cookies?.find(cookie => cookie.startsWith("refreshToken"));

    const refresh = authHeader && authHeader.split("=")[1];
    
    let tokenStruct;
    try {
        tokenStruct = refresh.split(".")[1];
    } catch (error) {
        res.status(400).json({ message: "Erro ao localizar token!", error: error.message});
    }

    const payload = atob(tokenStruct);
    
    try {
        const refreshToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            id: JSON.parse(payload).id
        },
        process.env.REFRESH,
        { algorithm: 'HS256' }
        );
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            id: JSON.parse(payload).id
        },
        process.env.TOKEN,
        { algorithm: 'HS256' }
        );
        res.cookie("accessToken", token,{httpOnly:true, secure: true, sameSite: "none"})
        .cookie("refreshToken", refreshToken,{httpOnly:true, secure: true, sameSite: "none"})
        .status(200).json({ 
            msg:"Token atualizado com sucesso!!",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro ao fazer login!" });
    }
}

export const logout = (req, res) => {
    return res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .clearCookie("refreshToken", { secure: true, sameSite: "none" })
    .status(200)
    .json({ msg: "Usuário deslogado com sucesso!" });
};

export const redefinirSenha = (req, res) => {
    const {user_type, email, password, newPassword, confirmNewPassword} = req.body;
    if (!user_type || !email || !password || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "As senhas não coincidem." });
    } else {
        let user_db = "";

        if (user_type == "anunciante") {
            user_db = "anunciantes"
        } else if (user_type == "cliente") {
            user_db = 'clientes'
        }

        const sqlQuery = `SELECT * FROM ${user_db} WHERE email = ?`;

        db.query(
            sqlQuery,
            [email],
            async (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao fazer requisição." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];
                    
                    const checkPassword = await bcrypt.compare(password, user.password);
                    
                    if (!checkPassword) {
                        return res.status(422).json({ message: "Senha incorreta." });
                    }
                    
                    try {

                    const newPasswordHash = await bcrypt.hash(newPassword, 8);

                    const newAnunciante = {
                        password: newPasswordHash,
                    };

                    const sqlQuery2 = `UPDATE ${user_db} SET ? WHERE email = ?`;

                    db.query(sqlQuery2, [newAnunciante, email], (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: "Erro ao atualizar a senha." });
                        } else {
                            const refreshToken = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                            id: user.password
                            },
                            process.env.REFRESH,
                            { algorithm: 'HS256' }
                            );
                            const token = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                                id: user.password
                            },
                            process.env.TOKEN,
                            { algorithm: 'HS256' }
                            );
                            delete user.password;
                            res.cookie("accessToken", token,{httpOnly:true, secure: true, sameSite: "none"})
                            .cookie("refreshToken", refreshToken,{httpOnly:true, secure: true, sameSite: "none"})
                            .status(200).json({ 
                                msg:"Senha alterada com sucesso", 
                                user
                    });
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro ao atualizar senha!" });
        }
    }         
})}};

export const atualizarInformação = (req, res) => {
    const {
        imagem_url,
        user_type, 
        email, 
        password, 
        confirm_password, 
        cnpj, 
        razao_social,
        endereco, 
        nome_comercial, 
        nome_completo, 
        nascimento, 
        genero, 
        celular} = req.body

    if (password !== confirm_password) {
        return res.status(400).json({ message: "As senhas não coincidem. As informações não foram atualizadas" });
    } else {
        let user_db = "";

        if (user_type == "anunciante") {
            user_db = "anunciantes"
        } else if (user_type == "cliente") {
            user_db = 'clientes'
        }
        const sqlQuery = `SELECT * FROM ${user_db} WHERE email = ?`;

        db.query(
            sqlQuery,
            [email],
            async(error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao fazer requisição." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];
                    
                    const checkPassword = await bcrypt.compare(password, user.password);
                    
                    if (!checkPassword) {
                        return res.status(422).json({ message: "Senha incorreta." });
                    }
                }
                
                let atualizacao;

                if (user_type == "anunciante") {
                    atualizacao = {
                        cnpj,
                        razao_social,
                        nome_comercial,
                        endereco,
                        imagem_url,
                    }
                } else if (user_type == "cliente") {
                    atualizacao = {
                        email,
                        nome_completo,
                        nascimento: nascimento.split('T')[0],
                        genero,
                        celular,
                        endereco,
                        imagem_url,
                    }
                }

                if (endereco) {
                    try {
                      const { lat, lng } = await geocodeAddress(endereco);
                      atualizacao.latitude = lat;
                      atualizacao.longitude = lng;
                    } catch (error) {
                      console.log(error);
                      return res.status(500).json({ message: "Erro ao geocodificar o endereço." });
                    }
                }
                
                const sqlQuery2 = `UPDATE ${user_db} SET ? WHERE email = ?`;

                db.query(sqlQuery2, [atualizacao, email], (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao atualizar as informações." });
                    } else {
                        if (user_type == "anunciante") {
                            db.query(`SELECT * FROM anuncios WHERE email = ?`, [email], (error, updateddata) => {})
                        }
                        db.query(`SELECT * FROM ${user_db} WHERE email = ?`, [email], (error, updateddata) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: "Erro ao atualizar as informações." });
                            } else {
                                return res.status(200).json({ data: updateddata });
                            }
                        }
                    )
                }
            }
        )
        
    })
}}

export const atualizarInformaçãoAdm = (req, res) => {
    const {
        imagem_url,
        user_type, 
        email,
        email_adm, 
        cnpj, 
        razao_social,
        endereco, 
        nome_comercial, 
        cpf, 
        nome_completo, 
        nascimento, 
        genero, 
        celular,
        moedas
    } = req.body

    if (email_adm !== process.env.EMAIL_ADMIN) {
        return res.status(400).json({ message: "Administrador não cadastrado. Informações não foram atualizadas" });
    } else {
        let user_db = "";

        if (user_type == "anunciante") {
            user_db = "anunciantes"
        } else if (user_type == "cliente") {
            user_db = 'clientes'
        }
        const sqlQuery = `SELECT * FROM ${user_db} WHERE email = ?`;

        db.query(
            sqlQuery,
            [email],
            async(error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao fazer requisição." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    const user = data[0];
                }
                
                let atualizacao;

                if (user_type == "anunciante") {
                    atualizacao = {
                        cnpj,
                        razao_social,
                        nome_comercial,
                        endereco,
                        imagem_url,
                        moedas
                    }
                } else if (user_type == "cliente") {
                    atualizacao = {
                        email,
                        cpf,
                        nome_completo,
                        nascimento,
                        genero,
                        celular,
                        endereco,
                        imagem_url,
                    }
                }

                if (endereco) {
                    try {
                      const { lat, lng } = await geocodeAddress(endereco);
                      atualizacao.latitude = lat;
                      atualizacao.longitude = lng;
                    } catch (error) {
                      console.log(error);
                      return res.status(500).json({ message: "Erro ao geocodificar o endereço." });
                    }
                }
                
                const sqlQuery2 = `UPDATE ${user_db} SET ? WHERE email = ?`;

                db.query(sqlQuery2, [atualizacao, email], (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao atualizar as informações." });
                    } else {
                        if (user_type == "anunciante") {
                            db.query(`SELECT * FROM anuncios WHERE email = ?`, [email], (error, updateddata) => {})
                        }
                        db.query(`SELECT * FROM ${user_db} WHERE email = ?`, [email], (error, updateddata) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: "Erro ao atualizar as informações." });
                            } else {
                                return res.status(200).json({ data: updateddata });
                            }
                        }
                    )
                }
            }
        )
        
    })
}}

export const atualizarOfertaAdm = (req, res) => {
    const {
        id_anuncio,
        preco_original,
        preco_oferta,
        categoria_produto,
        marca_produto,
        descricao_oferta,
        email_adm
    } = req.body

    if (email_adm !== process.env.EMAIL_ADMIN) {
        return res.status(400).json({ message: "Administrador não cadastrado. Informações não foram atualizadas" });
    } else {

        const sqlQuery = `SELECT * FROM anuncios WHERE id_anuncio = ?`;

        db.query(sqlQuery, [id_anuncio], async (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao fazer requisição." });
            }
            if (data.length === 0) {
                return res.status(404).json({ message: "Anúncio não encontrado." });
            } else {
                const atualizacao = {
                    preco_original,
                    preco_oferta,
                    categoria_produto,
                    marca_produto,
                    descricao_oferta
                };

                const sqlQuery2 = `UPDATE anuncios SET ? WHERE id_anuncio = ?`;

                db.query(sqlQuery2, [atualizacao, id_anuncio], (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Erro ao atualizar as informações." });
                    } else {
                        db.query(`SELECT * FROM anuncios WHERE id_anuncio = ?`, [id_anuncio], (error, updateddata) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: "Erro ao atualizar as informações." });
                            } else {
                                return res.status(200).json({ data: updateddata });
                            }
                        });
                    }
                });
            }
        });

}}

export const redefinirSenhaLink = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "As senhas não coincidem." });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN);
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        let query = "";
        let params = [hashedPassword, decoded.id];

        if (decoded.user_type == "anunciante") {
            query = "UPDATE anunciantes SET password = ? WHERE id = ?";
        } else if (decoded.user_type == "cliente") {
            query = "UPDATE clientes SET password = ? WHERE id = ?";
        } else {
            return res.status(403).json({ message: "Token inválido." });
        }

        db.query(query, params, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao redefinir a senha." });
            } else {
                return res.status(200).json({ message: "Senha redefinida com sucesso." });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao redefinir a senha." });
    }
}

export const getPublicKey = (req, res) => {
    const publicKey = process.env.PAGSEGURO_PUBLIC_KEY;
    if (publicKey) {
        res.status(200).json({ publicKey });
    } else {
        res.status(500).json({ message: 'Public key not found' });
    }
};


export const confirmEmailAnunciante = (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN);
        const { email } = decoded;

        let query = "";
        let params = [email];

        query = "UPDATE anunciantes SET email_confirm = 1 WHERE email = ?";

        db.query(query, params, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao confirmar o email." });
            } else {
                return res.status(200).json({ message: "Email confirmado com sucesso." });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao confirmar o email." });
    }
};

export const confirmEmailUsuario = (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN);
        const { email } = decoded;

        let query = "";
        let params = [email];

        query = "UPDATE clientes SET email_confirm = 1 WHERE email = ?";

        db.query(query, params, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao confirmar o email." });
            } else {
                return res.status(200).json({ message: "Email confirmado com sucesso." });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao confirmar o email." });
    }
};