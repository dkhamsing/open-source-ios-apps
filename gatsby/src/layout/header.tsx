import { AppBar, Button, Link, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Link as GatsbyLink } from 'gatsby'
import React, { FC } from 'react'

const useStyles = makeStyles({
  toolbar: {},
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
  },
})

export interface HeaderProps {
  siteTitle?: string
}

const Header: FC<HeaderProps> = ({ siteTitle = '' }) => {
  const classes = useStyles()

  return (
    <AppBar component="header" position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title}>
          <Link
            to="/"
            component={GatsbyLink}
            color="inherit"
            className={classes.link}
          >
            {siteTitle}
          </Link>
        </Typography>
        <Button
          color="inherit"
          component="a"
          href="https://github.com/dkhamsing/open-source-ios-apps"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
