/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const crypto = require('crypto')
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const Bluebird = require('bluebird')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateNode = async ({ node, actions, getCache, createNodeId }) => {
  const { createNode } = actions
  if (node.internal.type === 'OpenSourceIosAppsJson') {
    const { categories, projects } = node

    categories.forEach(category => {
      if (typeof category.id !== 'string' || category.id.length < 1) {
        console.error('Invalid category #veJYyW', category)
        return
      }

      // Count how many projects are in each category. We can't easily do this
      // in Gatsby's GraphQL API.
      const projectCount = projects.filter(project =>
        project['category-ids'].includes(category.id),
      ).length

      createNode({
        ...category,
        slug: category.id,
        parentSlug: category.parent,
        projectCount,
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

    await Bluebird.each(projects, async project => {
      const contentDigest = crypto
        .createHash(`md5`)
        .update(JSON.stringify(project))
        .digest(`hex`)
      const id = `Project__${contentDigest}`

      const projectNode = await createNode({
        ...project,
        parent: node.id,
        id,
        internal: {
          type: `AppProject`,
          contentDigest,
          content: JSON.stringify(project),
        },
      })

      if (project.screenshots && project.screenshots.length > 0) {
        await Bluebird.each(project.screenshots, async url => {
          try {
            await createRemoteFileNode({
              url,
              parentNodeId: projectNode.id,
              getCache,
              createNode,
              createNodeId,
            })
          } catch (error) {
            console.error('Error creating remote node. #VvXNlr', error)
          }
        })
      }
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
