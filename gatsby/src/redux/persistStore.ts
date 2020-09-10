import { RootState } from './store'

export const loadState: () => RootState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null || serializedState === 'undefined') {
      return undefined
    }

    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = (state: Partial<RootState>) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}
