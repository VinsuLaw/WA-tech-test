import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/user.slice'
import taskReducer from './reducers/task.slice'

const rootReducer = combineReducers({
    userReducer, taskReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']