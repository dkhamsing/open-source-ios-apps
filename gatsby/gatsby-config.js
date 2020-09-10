/* eslint-disable @typescript-eslint/no-var-requires */
const join = require('path').join

module.exports = {
  pathPrefix: '/open-source-ios/',
  siteMetadata: {
    title: `Open Source iOS Apps`,
    description: `A collaborative list of open-source iOS, watchOS and tvOS apps.`,
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
        name: `open-source-ios-apps`,
        short_name: `os-ios-apps`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#3E3F3A`,
        display: `minimal-ui`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `apps`,
        path: join(__dirname, `../`),
        // This aims to ignore everything EXCEPT the `contents.json` file at the
        // root of the repo
        ignore: [
          `**/.*`,
          `**/.*/**`,
          `**/gatsby/**`,
          `**/*.md`,
          `**/*.toml`,
          `**/LICENSE`,
          `**/Dangerfile`,
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
