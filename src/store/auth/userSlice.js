import { createSlice } from '@reduxjs/toolkit'


export const userSlice = createSlice({
	name: 'auth/user',
	initialState:{
        userData:""
    },
	reducers: {
        setUser: (state, action) => {
            state.userData = action.payload
        },
        userLoggedOut: (state, action) => {
            state.userData = ""
        },
	},
})

export const { setUser,userLoggedOut } = userSlice.actions

export default userSlice.reducer