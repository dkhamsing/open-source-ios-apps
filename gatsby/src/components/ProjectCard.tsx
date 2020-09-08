import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import { Project } from '../types'

const urlToReaddable = (url: string) => {
  if (url.indexOf('https://github.com/') === 0) {
    return `@${url.substr('https://github.com/'.length)}`
  } else if (url.indexOf('http://github.com/') === 0) {
    return `@${url.substr('http://github.com/'.length)}`
  } else return url
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h3">{project.title}</Typography>
        <Typography>Added: {project.date_added}</Typography>
        <Typography>Stars: {project.stars}</Typography>
        <Typography>{project.description}</Typography>
        <Typography>
          Source:{' '}
          {project.source ? (
            <a href={project.source} target="_blank" rel="noreferrer">
              {urlToReaddable(project.source)}
            </a>
          ) : (
            'n/a'
          )}
        </Typography>
        <Typography>
          iTunes:{' '}
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
      </CardContent>
    </Card>
  )
}

export default ProjectCard
