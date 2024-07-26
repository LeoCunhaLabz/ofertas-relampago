import axios from "axios"

export const makeRequest = axios.create({
    baseURL: 'http://167.88.39.189:8000/api/',
    withCredentials: true
    })