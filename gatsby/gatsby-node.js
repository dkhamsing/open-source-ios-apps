/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const crypto = require('crypto')
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

exports.onCreateNode = async ({ node, actions }) => {
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
    })
  }
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const categoryTemplate = path.resolve('src/templates/category.tsx')
  const tagTemplate = path.resolve('src/templates/tag.tsx')

  const categoryResult = await graphql(`
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

  const categories = categoryResult.data.allAppCategory.edges

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

  const projectResult = await graphql(`
    query Projects {
      allAppProject {
        edges {
          node {
            id
            tags
          }
        }
      }
    }
  `)

  const projects = projectResult.data.allAppProject.edges
  const tags = new Set()

  projects.forEach(({ node: project }) => {
    if (project.tags && project.tags.length > 0) {
      project.tags.forEach(tag => {
        tags.add(tag)
      })
    }
  })

  tags.forEach(tag => {
    createPage({
      path: `/tag/${tag}/`,
      component: tagTemplate,
      context: {
        tag,
        slug: tag,
      },
    })
  })
}
