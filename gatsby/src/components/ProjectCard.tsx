import {
  Card,
  CardContent,
  createStyles,
  Divider,
  GridList,
  GridListTile,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import Star from '@material-ui/icons/Star'
import { graphql, Link } from 'gatsby'
import React, { useState } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { Project } from '../types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    description: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      fontSize: '1.2em',
    },
    tag: {
      marginRight: theme.spacing(1),
    },
  }),
)

const urlToReaddable = (url: string) => {
  if (url.indexOf('https://github.com/') === 0) {
    return `@${url.substr('https://github.com/'.length)}`
  } else if (url.indexOf('http://github.com/') === 0) {
    return `@${url.substr('http://github.com/'.length)}`
  } else return url
}

const starCountToIconCount = (githubStars: number): number => {
  if (githubStars > 2000) {
    return 5
  } else if (githubStars > 1000) {
    return 4
  } else if (githubStars > 500) {
    return 3
  } else if (githubStars > 200) {
    return 2
  } else if (githubStars > 100) {
    return 1
  } else return 0
}

const RepeatingStars = ({ count }: { count: number }) => {
  return (
    <span>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} />
      ))}
    </span>
  )
}

const ProjectCard = ({ project }: { project: Project }) => {
  const classes = useStyles()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxSlide, setLightboxSlide] = useState(0)

  const showStarCount = starCountToIconCount(project.stars)
  const screenshotSources = project.screenshots || []
  const tags = project.tags || []

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h2">
          {project.title}
        </Typography>
        {showStarCount > 0 ? <RepeatingStars count={showStarCount} /> : null}
        <Typography className={classes.description}>
          {project.description}
        </Typography>
        <Divider />
        <Typography>Language: {project.lang || 'en'}</Typography>
        <Typography>Added: {project.date_added || 'n/a'}</Typography>
        <Typography>GitHub Stars: {project.stars}</Typography>
        <Typography>
          Code:{' '}
          {project.source ? (
            <a href={project.source} target="_blank" rel="noreferrer">
              {urlToReaddable(project.source)}
            </a>
          ) : (
            'n/a'
          )}
        </Typography>
        <Typography>
          License:{' '}
          {project.license ? (
            <a
              href={`https://choosealicense.com/licenses/${project.license}/`}
              target="_blank"
              rel="noreferrer"
            >
              {project.license}
            </a>
          ) : (
            'n/a'
          )}
        </Typography>
        <Typography>
          App Store:{' '}
          {project.itunes ? (
            <a href={project.itunes} target="_blank" rel="noreferrer">
              {project.itunes}
            </a>
          ) : (
            'n/a'
          )}
        </Typography>
        <Typography>
          Homepage:{' '}
          {project.homepage ? (
            <a href={project.homepage} target="_blank" rel="noreferrer">
              {project.homepage}
            </a>
          ) : (
            'n/a'
          )}
        </Typography>
        <Typography>
          Tags:{' '}
          {tags.map(tag => {
            return (
              <Link key={tag} to={`/tag/${tag}/`} className={classes.tag}>
                #{tag}
              </Link>
            )
          })}
        </Typography>
        {screenshotSources.length === 0 ? null : (
          <>
            <GridList cellHeight={160} cols={4}>
              {screenshotSources.map((url, i) => {
                return (
                  <GridListTile key={i} cols={1}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={event => {
                        event.preventDefault()
                        setLightboxSlide(i)
                        setIsLightboxOpen(true)
                      }}
                    >
                      <img src={url} width="120" height="160" />
                    </a>
                  </GridListTile>
                )
              })}
            </GridList>
            {!isLightboxOpen ? null : (
              <Lightbox
                mainSrc={screenshotSources[lightboxSlide]}
                nextSrc={screenshotSources[lightboxSlide + 1]}
                prevSrc={screenshotSources[lightboxSlide - 1]}
                onCloseRequest={() => setIsLightboxOpen(false)}
                onMoveNextRequest={() => {
                  setLightboxSlide(
                    (lightboxSlide + screenshotSources.length + 1) %
                      screenshotSources.length,
                  )
                }}
                onMovePrevRequest={() => {
                  setLightboxSlide(
                    (lightboxSlide + screenshotSources.length - 1) %
                      screenshotSources.length,
                  )
                }}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectCard

export const projectCardFragment = graphql`
  fragment ProjectCardFields on AppProject {
    category_ids
    date_added
    description
    homepage
    id
    itunes
    lang
    license
    screenshots
    source
    stars
    suggested_by
    tags
    title
  }
`
