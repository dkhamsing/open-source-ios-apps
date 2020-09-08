import React, { FC } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { Grid, Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import SEO from '../components/seo'
import Hero from '../components/hero'

const useStyles = makeStyles((theme: Theme) => ({
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}))

const IndexPage: FC = () => {
  const classes = useStyles()
  return (
    <>
      <SEO title="Home" />
      <Hero
        title="Hi people"
        description="Welcome to your new Gatsby site. Now go build something great with
          Typescript and Material-ui."
      >
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button
                component={GatsbyLink}
                to="/page-2/"
                variant="contained"
                color="primary"
              >
                Go to page 2
              </Button>
            </Grid>
          </Grid>
        </div>
      </Hero>
    </>
  )
}

export default IndexPage
