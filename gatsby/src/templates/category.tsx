import {
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { graphql } from 'gatsby'
import React from 'react'
import Hero from '../components/hero'
import SEO from '../components/seo'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  }),
)

const Category = props => {
  const classes = useStyles()

  const category = props.data.appCategory
  const projectEdges = props.data.allAppProject.edges
  const projects = projectEdges.map(n => n.node)

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
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card>
                  <CardContent>
                    <Typography>{project.title}</Typography>
                    <Typography>Added: {project.date_added}</Typography>
                    <Typography>Stars: {project.stars}</Typography>
                    <Typography>{project.description}</Typography>
                    <Typography>
                      Source:{' '}
                      <a href={project.source} target="_blank" rel="noreferrer">
                        {project.source}
                      </a>
                    </Typography>
                    <Typography>
                      iTunes:{' '}
                      <a href={project.itunes} target="_blank" rel="noreferrer">
                        {project.itunes}
                      </a>
                    </Typography>
                    <Typography>
                      Homepage:{' '}
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.homepage}
                      </a>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </>
  )
}

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
          id
          title
          category_ids
          date_added
          description
          license
          screenshots
          source
          stars
          suggested_by
          tags
        }
      }
    }
  }
`

export default Category
