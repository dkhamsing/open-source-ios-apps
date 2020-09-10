import React, { FC } from 'react'

import { makeStyles } from '@material-ui/styles'
import { Container, Typography, Theme, Link } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
}))

const Footer: FC = () => {
  const classes = useStyles()
  return (
    <footer className={classes.footer}>
      <Container maxWidth="md">
        <Typography variant="body1" color="textSecondary">
          Built with the data from{' '}
          <Link
            href="https://github.com/dkhamsing/open-source-ios-apps"
            target="_blank"
            rel="noreferrer"
          >
            @dkhamsing/open-source-ios-apps
          </Link>
        </Typography>
      </Container>
    </footer>
  )
}

export default Footer
