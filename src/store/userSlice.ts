// src/store/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  token: string | null
  email: string | null
  name: string | null
}

const initialState: UserState = {
  token: localStorage.getItem("token"),
  email: localStorage.getItem("email"),
  name:  localStorage.getItem("name"),
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; email: string; name: string }>
    ) {
      const { token, email, name } = action.payload
      state.token = token
      state.email = email
      state.name  = name

      localStorage.setItem("token", token)
      localStorage.setItem("email", email)
      localStorage.setItem("name",  name)
    },

    logout(state) {
      state.token = null
      state.email = null
      state.name  = null

      localStorage.removeItem("token")
      localStorage.removeItem("email")
      localStorage.removeItem("name")
    },
  },
})

export const { setCredentials, logout } = userSlice.actions
export default userSlice.reducer
