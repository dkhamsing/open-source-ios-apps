import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import app from '../redux/appModule'
import { loadState, saveState } from './persistStore'

const preloadedState = loadState()

const rootReducer = combineReducers({
  app,
})

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
})

store.subscribe(() => {
  const { app } = store.getState()
  saveState({ app })
})

export type RootState = ReturnType<typeof rootReducer>
export type RootDispatch = typeof store.dispatch

export default store
