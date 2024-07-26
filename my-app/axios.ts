import axios from "axios"

export const makeRequest = axios.create({
    baseURL: 'https://api.ofertarelampago.app.br/api/',
    withCredentials: true
    })