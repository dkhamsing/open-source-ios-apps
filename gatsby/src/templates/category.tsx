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
  }),
)

type CategoryProps = {
  data: {
    appCategory: Category
    allAppProject: {
      edges: {
        node: Project
      }
    }
  }
}

const CategoryItem: React.FC<CategoryProps> = props => {
  const classes = useStyles()

  const category = props.data.appCategory
  const projectEdges = props.data.allAppProject.edges
  const projects: Project[] = projectEdges.map(n => n.node)

  return (
    <>
      <SEO title="Home" />
      <Hero
        title={`Category: ${category.title}`}
        description={category.description || ''}
      ></Hero>
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

export default CategoryItem

export const pageQuery = graphql`
  query CategoryPageQuery($slug: String!) {
    appCategory(slug: { eq: $slug }) {
      id
      description
      slug
      title
    }

    allAppProject(filter: { category_ids: { eq: $slug } }) {
      edges {
        node {
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
          children {
            id
            ... on File {
              url
              publicURL
              childImageSharp {
                ... on ImageSharp {
                  thumbnail: fixed(width: 120, height: 160) {
                    ...GatsbyImageSharpFixed
                  }
                  fullsize: fixed(width: 120, height: 160) {
                    ...GatsbyImageSharpFixed
                  }
                  original {
                    width
                    height
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
