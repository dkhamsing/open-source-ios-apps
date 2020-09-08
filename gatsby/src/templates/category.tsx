import React from 'react'
import SEO from '../components/seo'
import Hero from '../components/hero'
import { graphql } from 'gatsby'

const Category = props => {
  const category = props.data.appCategory
  const projectEdges = props.data.allAppProject.edges
  const projects = projectEdges.map(n => n.node)

  return (
    <>
      <SEO title="Home" />
      <Hero
        title={`Category: ${category.title}`}
        description="A community curated set of open source iOS apps."
      ></Hero>
      <ul>
        {projects.map(p => {
          return <li key={p.id}>title: {p.title}</li>
        })}
      </ul>
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
