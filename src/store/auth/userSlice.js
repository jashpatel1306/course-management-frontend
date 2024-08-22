import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    avatar: '',
    userName: 'test',
    email: 'test@gmail.com',
    authority: []
}

export const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
        setUser: (_, action) => action.payload,
        userLoggedOut: () => initialState,
	},
})

export const { setUser } = userSlice.actions

export default userSlice.reducer