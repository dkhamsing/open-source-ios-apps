/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const crypto = require('crypto')
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const Bluebird = require('bluebird')

// Set this to true to enable more logging in this file
const DEBUG = false
const isDev = process.env.NODE_ENV === 'development'

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onCreateNode = async ({ node, actions, getCache, createNodeId }) => {
  const { createNode, createParentChildLink } = actions
  if (node.internal.type === 'OpenSourceIosAppsJson') {
    const { categories, projects } = node

    const limit = isDev ? 10 : 0
    let count = 0

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

      const projectNode = {
        ...project,
        parent: node.id,
        id,
        internal: {
          type: `AppProject`,
          contentDigest,
          content: JSON.stringify(project),
        },
      }
      await createNode(projectNode)

      if (project.screenshots && project.screenshots.length > 0) {
        // In development, we want to limit how many images we download,
        // otherwise it takes forever and uses >800MB of disk space.
        if (limit > 0 && count > limit) {
          return
        }
        count = count + project.screenshots.length

        await Bluebird.each(project.screenshots, async url => {
          try {
            const fileNode = await createRemoteFileNode({
              url,
              parentNodeId: id,
              getCache,
              createNode,
              createNodeId,
            })
            if (DEBUG && isDev) {
              console.log('SUCCESS createRemoteFileNode() #kOaKVj', {
                nodeId: id,
                url,
                projectNode,
                fileNode,
              })
            }
            // NOTE: Without this, we cannot access this node as a child.
            createParentChildLink({ parent: projectNode, child: fileNode })
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
