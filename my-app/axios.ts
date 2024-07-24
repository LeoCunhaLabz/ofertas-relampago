import axios from "axios"

export const makeRequest = axios.create({
    baseURL: process.env.BACKEND_URL,
    withCredentials: true
    })