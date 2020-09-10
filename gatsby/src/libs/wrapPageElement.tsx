import React, { ReactNode } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'

import themes from '../theme'
import Layout from '../layout'

const wrapPageElement = ({ element }: { element: ReactNode }) => {
  return (
    <ThemeProvider theme={themes['light']}>
      <CssBaseline />
      <Layout>{element}</Layout>
    </ThemeProvider>
  )
}

export default wrapPageElement
