import { createSlice } from '@reduxjs/toolkit'

export interface AppState {
  theme: 'light' | 'dark'
}

const initialState: AppState = {
  theme: 'light',
}

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme(state) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      state.theme = newTheme
    },
  },
})

export const { toggleTheme } = app.actions

export default app.reducer
