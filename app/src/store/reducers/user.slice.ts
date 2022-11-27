import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IUser {
    uid: string|null
}

const initialState: IUser = {
    uid: localStorage.getItem('UID')
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUid(state, action: PayloadAction<string>) {    
            state.uid = action.payload
            localStorage.setItem('UID', action.payload)
        },

        removeUid(state) {
            state.uid = null
            localStorage.removeItem('UID')
        }
    },
})

export default userSlice.reducer