import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core'
import { graphql } from 'gatsby'
import React from 'react'
import Hero from '../components/hero'
import ProjectCard from '../components/ProjectCard'
import SEO from '../components/seo'
import { Category, Project } from '../types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    backButton: {
      textAlign: 'center',
      margin: theme.spacing(4),
    },
  }),
)

type Props = {
  data: {
    appCategory: Category
    allAppProject: {
      edges: {
        node: Project
      }[]
    }
  }
  pageContext: {
    tag: string
    slug: string
  }
}

const TagTemplate: React.FC<Props> = props => {
  const classes = useStyles()

  const projectEdges = props.data.allAppProject.edges
  const projects: Project[] = projectEdges.map(n => n.node)

  return (
    <>
      <SEO title="Home" />
      <Hero title={`Tag: #${props.pageContext.tag}`} description=""></Hero>
      <div className={classes.wrapper}>
        <Grid container spacing={2}>
          {projects.map(project => {
            return (
              <Grid item xs={12} sm={6} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            )
          })}
        </Grid>
      </div>
    </>
  )
}

export default TagTemplate

export const pageQuery = graphql`
  query TagPageQuery($slug: String!) {
    allAppProject(filter: { tags: { eq: $slug } }) {
      edges {
        node {
          ...ProjectCardFields
        }
      }
    }
  }
`
