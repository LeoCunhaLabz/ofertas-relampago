import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from 'axios';

let user_type = "anunciante";

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
        if (!username || !email || !password || !confirmPassword || !cnpj || !razao_social || !nome_comercial || !endereco) {
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
                            return res.status(201).json({ message: "Usuário registrado com sucesso." });
                        }
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Erro ao registrar o usuário." });
                }
            }
        });
    } else if (user_type == "cliente") {

        // Verificar se os campos obrigatórios foram preenchidos
        if (!username || !email || !password || !confirmPassword || !cpf || !nome_completo || !nascimento || !genero || !celular || !endereco) {
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
                        res.cookie("accessToken", token,{httpOnly:true})
                        .cookie("refreshToken", refreshToken,{httpOnly:true})
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
                        res.cookie("accessToken", token,{httpOnly:true})
                        .cookie("refreshToken", refreshToken,{httpOnly:true})
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

    if (!email) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos." });
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
                    return res.status(200).json({ message: "Email de recuperação enviado com sucesso!" });
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
                    return res.status(500).json({ message: "Erro ao recuperar senha." });
                }
                if (data.length === 0) {
                    return res.status(404).json({ message: "Usuário não encontrado." });
                } else {
                    return res.status(200).json({ message: "Email enviado com sucesso!" });
                }
            }
        )         
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
        res.cookie("accessToken", token,{httpOnly:true})
        .cookie("refreshToken", refreshToken,{httpOnly:true})
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
                            res.cookie("accessToken", token,{httpOnly:true})
                            .cookie("refreshToken", refreshToken,{httpOnly:true})
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
        cpf, 
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