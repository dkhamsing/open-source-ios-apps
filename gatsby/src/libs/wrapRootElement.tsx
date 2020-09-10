import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

import store from '../redux/store'

const wrapRootElement = ({ element }: { element: ReactNode }) => {
  return <Provider store={store}>{element}</Provider>
}

export default wrapRootElement
