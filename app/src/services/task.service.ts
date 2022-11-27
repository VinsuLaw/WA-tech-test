import { NavigateFunction } from 'react-router-dom';
import { task_api } from './../http/index';

export default class TaskService {
    static async create(obj: { title: string, description: string, deadline: string, files: File[] }, fnRedirect: NavigateFunction): Promise<any> {
        try {
            const formData = new FormData()
            formData.append('title', obj.title)
            formData.append('description', obj.description)
            formData.append('deadline', obj.deadline)

            obj.files.forEach(file => {
                formData.append('file', file)
            });

            return (await task_api.post('/create', formData)).data
        } catch (e: any) {
            if (e.response.status === 401) {
                fnRedirect('/')
            }
            return { status: e.response.status, message: e.response.data.message }
        }
    }

    static async get(id: number | null, fnRedirect: NavigateFunction, uid: string | null): Promise<any> {
        try {
            if (id) {
                return (await task_api.get(`/get?id=${id}`)).data
            } else {
                const config = {
                    headers: {
                        Authorization: uid
                    }
                }
                return (await task_api.get(`/get`, config)).data
            }
        } catch (e: any) {
            return { status: e.response.status, message: e.response.data.message }
        }
    }

    static async update(id: number, field: string, value: any, deleted_file = '', action = ''): Promise<any> {
        try {
            console.log(value);

            const formData = new FormData()
            formData.append('id', String(id))
            formData.append('field', field)
            formData.append('deleted_file', deleted_file)
            formData.append('action', action)

            if (action === 'upload') {
                value.forEach((file: any) => {
                    formData.append('file', file)
                });
            }

            formData.append('value', value)

            console.log('send');

            return (await task_api.post('/update', formData)).data
        } catch (e: any) {
            console.log(e);
            return { status: e.response.status, message: e.response.data.message }
        }
    }

    static async delete(id: number): Promise<any> {
        try {
            return (await task_api.delete(`/delete?id=${id}`)).data
        } catch (e: any) {
            return { status: e.response.status, message: e.response.data.message }
        }
    }
}