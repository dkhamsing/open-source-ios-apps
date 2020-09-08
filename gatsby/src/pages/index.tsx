import { List, ListItem, ListItemText, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { graphql, navigate } from 'gatsby'
import React, { FC } from 'react'
import Hero from '../components/hero'
import SEO from '../components/seo'

const useStyles = makeStyles((theme: Theme) => ({
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
    <ListItem
      button
      style={{ display: 'block' }}
      onClick={event => {
        event.stopPropagation()
        navigate(`/category/${category.slug}/`)
      }}
    >
      <ListItemText primary={category.title} />
      {childCategories.length === 0 ? null : (
        <div>
          <List>
            {childCategories.map(cat => {
              return (
                <CategoryItem
                  key={cat.id}
                  category={cat}
                  categories={categories}
                />
              )
            })}
          </List>
        </div>
      )}
    </ListItem>
  )
}

type Category = {
  id: string
  slug: string
  parentSlug: string | null
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
  }
}

const IndexPage: FC<IndexPageProps> = props => {
  const classes = useStyles()

  const { edges: categoryEdges } = props.data.allAppCategory

  const categories = categoryEdges.map(e => e.node)

  const topLevelCategories = categories.filter(category => {
    return category.parentSlug === null
  })

  return (
    <>
      <SEO title="Home" />
      <Hero
        title="Open Source iOS Apps"
        description="A community curated set of open source iOS apps."
      >
        <div>
          <List>
            {topLevelCategories.map(cat => {
              return (
                <CategoryItem
                  key={cat.id}
                  category={cat}
                  categories={categories}
                />
              )
            })}
          </List>
        </div>
      </Hero>
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
          description
          title
        }
      }
    }
  }
`

export default IndexPage
