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

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}))

const CategoryItem = ({
  category,
  categories,
}: {
  category: Category
  categories: Category[]
}) => {
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
          <Link to={`/category/${category.slug}/`}>
            <Button fullWidth>Browse {category.title}.</Button>
          </Link>

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

type Category = {
  id: string
  slug: string
  parentSlug: string | null
  projectCount: number
  description: string | null
  title: string | null
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
