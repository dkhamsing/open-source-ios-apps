/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const categoryTemplate = path.resolve('src/templates/category.tsx')

  const results = await graphql(`
    query Categories {
      openSourceIosAppsJson {
        categories {
          id
        }
      }
    }
  `)

  const { categories } = results.data.openSourceIosAppsJson

  console.error('Categories count #ebMYvK', categories.length, categories)

  categories.forEach(category => {
    createPage({
      path: `/category/${category.id}/`,
      component: categoryTemplate,
      context: {
        id: category.id,
      },
    })
  })
}
