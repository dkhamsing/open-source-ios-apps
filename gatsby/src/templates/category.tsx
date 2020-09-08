import React from 'react'
import SEO from '../components/seo'
import Hero from '../components/hero'
import { graphql } from 'gatsby'

const Category = props => {
  const category = props.data.appCategory

  return (
    <>
      <SEO title="Home" />
      <Hero
        title={`Category: ${category.title}`}
        description="A community curated set of open source iOS apps."
      ></Hero>
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
  }
`

export default Category
