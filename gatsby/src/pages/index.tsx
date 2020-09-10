import {
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Theme,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { graphql, Link } from 'gatsby'
import React, { FC } from 'react'
import Hero from '../components/hero'
import SEO from '../components/seo'
import { Category } from '../types'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

const CategoryItem = ({
  category,
  categories,
}: {
  category: Category
  categories: Category[]
}) => {
  const classes = useStyles()

  const childCategories = categories.filter(
    cat => cat.parentSlug === category.slug,
  )

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h3">{category.title}</Typography>
          <Typography>{category.description}</Typography>
          <Typography>{category.projectCount} projects</Typography>
          <Button
            variant="contained"
            component={Link}
            fullWidth
            to={`/category/${category.slug}/`}
            className={classes.button}
          >
            Browse {category.title}
          </Button>

          {childCategories.length === 0 ? null : (
            <>
              <Typography variant="h5" component="h4">
                Child categories:
              </Typography>
              <List>
                {childCategories.map(childCategory => {
                  return (
                    <ListItem
                      button
                      key={childCategory.id}
                      component={Link}
                      to={`/category/${childCategory.slug}/`}
                    >
                      <ListItemText
                        primary={`${childCategory.title} (${childCategory.projectCount} projects)`}
                      />
                    </ListItem>
                  )
                })}
              </List>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}

type IndexPageProps = {
  data: {
    allAppCategory: {
      edges: {
        node: Category
      }[]
    }
    allAppProject: {
      totalCount: number
    }
  }
}

const IndexPage: FC<IndexPageProps> = props => {
  const classes = useStyles()

  const { edges: categoryEdges } = props.data.allAppCategory
  const projectCount = props.data.allAppProject.totalCount

  const categories = categoryEdges.map(e => e.node)

  const topLevelCategories = categories.filter(category => {
    return category.parentSlug === null
  })

  return (
    <>
      <SEO title="Home" />
      <Hero
        title="Open Source iOS Apps"
        description={`A community curated set of ${projectCount} open source iOS apps.`}
      />
      <div className={classes.wrapper}>
        <Grid container spacing={2}>
          {topLevelCategories.map(cat => {
            return (
              <CategoryItem
                key={cat.id}
                category={cat}
                categories={categories}
              />
            )
          })}
        </Grid>
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query IndexPageQuery {
    allAppCategory {
      edges {
        node {
          id
          slug
          parentSlug
          projectCount
          description
          title
        }
      }
    }
    allAppProject {
      totalCount
    }
  }
`

export default IndexPage
