import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { graphql, Link } from 'gatsby'
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
}

const CategoryTemplate: React.FC<Props> = props => {
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
      <Typography className={classes.backButton}>
        <Button component={Link} to="/" variant="contained">
          Back to category list
        </Button>
      </Typography>
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

export default CategoryTemplate

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
          ...ProjectCardFields
        }
      }
    }
  }
`
