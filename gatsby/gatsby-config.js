/* eslint-disable @typescript-eslint/no-var-requires */
const join = require('path').join

module.exports = {
  pathPrefix: '/open-source-ios/',
  siteMetadata: {
    title: `Open Source iOS Apps`,
    description: `A collaborative list of open-source iOS, watchOS and tvOS apps.`,
    author: {
      name: 'Callum Macdonald',
      content: 'I only built the web site, not the data',
    },
    social: {
      github: 'https://github.com/Junscuzzy',
    },
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-material-ui',
      // If you want to use styled components you should change the injection order.
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `apps`,
        path: join(__dirname, `../../open-source-ios-apps/`),
        ignore: [`**/\.*`],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
