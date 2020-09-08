export type Category = {
  id: string
  slug: string
  parentSlug: string | null
  projectCount: number
  description: string | null
  title: string | null
}

export type Project = {
  category_ids: string[]
  date_added: string
  description: string
  homepage: string
  id: string
  itunes: string
  lang: string
  license: string
  screenshots: string[]
  source: string
  stars: number
  suggested_by: string
  tags: string[]
  title: string
}
