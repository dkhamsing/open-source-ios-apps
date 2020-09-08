import React, { FC } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/styles'
import { Typography, Link, Container, Theme } from '@material-ui/core'

import SEO from '../components/seo'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}))

const SecondPage: FC = () => {
  const classes = useStyles()
  return (
    <Container maxWidth="md" className={classes.root}>
      <SEO title="Page two" />
      <Typography variant="h2" gutterBottom component="h1">
        Hi from the second page
      </Typography>

      <Typography variant="body1">Welcome to page 2.</Typography>

      <Typography variant="body1">
        <Link component={GatsbyLink} to="/">
          Go back to the homepage
        </Link>
      </Typography>
    </Container>
  )
}

export default SecondPage
