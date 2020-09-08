import { graphql, useStaticQuery } from 'gatsby'

export interface SiteMetadata {
  title: string
  description: string
  author: {
    name: string
    content: string
  }
  social: {
    github: string
  }
}

export default (): SiteMetadata => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
          author {
            name
            content
          }
          social {
            github
          }
        }
      }
    }
  `)

  return data.site.siteMetadata
}
