/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const crypto = require('crypto')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateNode = ({ node, actions }) => {
  const { createNode } = actions
  if (node.internal.type === 'OpenSourceIosAppsJson') {
    const { categories, projects } = node

    categories.forEach(category => {
      if (typeof category.id !== 'string' || category.id.length < 1) {
        console.error('Invalid category #veJYyW', category)
        return
      }

      createNode({
        ...category,
        parentSlug: category.parent,
        slug: category.id,
        id: `Category__${category.id}`,
        parent: node.id,
        internal: {
          type: `AppCategory`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(category))
            .digest(`hex`),
          content: JSON.stringify(category),
        },
      })
    })

    projects.forEach(project => {
      const contentDigest = crypto
        .createHash(`md5`)
        .update(JSON.stringify(project))
        .digest(`hex`)

      createNode({
        ...project,
        id: `Project__${contentDigest}`,
        parent: node.id,
        internal: {
          type: `AppProject`,
          contentDigest,
          content: JSON.stringify(project),
        },
      })
    })
  }
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const categoryTemplate = path.resolve('src/templates/category.tsx')

  const results = await graphql(`
    query Categories {
      allAppCategory {
        edges {
          node {
            id
            title
            slug
          }
        }
      }
    }
  `)

  const categories = results.data.allAppCategory.edges

  categories.forEach(({ node: category }) => {
    createPage({
      path: `/category/${category.slug}/`,
      component: categoryTemplate,
      context: {
        id: category.id,
        slug: category.slug,
      },
    })
  })
}
