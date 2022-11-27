import {auth_api} from "../http";

export default class AuthService {
    static async regin(uid: string): Promise<any> {
        try {
            return (await auth_api.post('/regin', {uid})).data
        } catch (e: any) {
            return {status: e.status, message: e.response.data.message}
        }   
    }

    static async login(uid: string): Promise<any> {
        try {
            return (await auth_api.post('/login', {uid})).data
        } catch (e: any) {
            return {status: e.status, message: e.response.data.message}
        }
    }
}