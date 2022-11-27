import axios from 'axios'

const API_URL = process.env.REACT_APP_API + '/api'
export const API_STATIC = process.env.REACT_APP_API

export const default_api = axios.create({
    withCredentials: false,
    baseURL: API_URL,
})

export const auth_api = axios.create({
    withCredentials: false,
    baseURL: API_URL + '/auth'
})

export const task_api = axios.create({
    withCredentials: false,
    baseURL: API_URL + '/task'
})