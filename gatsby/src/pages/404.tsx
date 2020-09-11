import React, { FC } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import SEO from '../components/seo'
import { Typography, Container } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}))

const NotFoundPage: FC = () => {
  const classes = useStyles()
  return (
    <Container maxWidth="md" className={classes.root}>
      <SEO title="404: Not found" />
      <Typography variant="h2" gutterBottom component="h1">
        NOT FOUND
      </Typography>
      <Typography variant="body1">
        You just hit a route that doesn&#39;t exist... the sadness.
      </Typography>
    </Container>
  )
}

export default NotFoundPage
