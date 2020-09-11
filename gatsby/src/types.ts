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
  description: string | null
  homepage: string | null
  id: string
  itunes: string | null
  lang: string | null
  license: string
  screenshots: string[]
  source: string | null
  stars: number
  suggested_by: string
  tags: string[]
  title: string
}
