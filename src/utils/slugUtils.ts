/**
 * Utility functions for creating and working with URL slugs
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert to slug
 * @returns A URL-friendly slug string
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing whitespace
}

/**
 * Create a slug from a gig/job title
 * @param title The title to convert
 * @param id Optional ID to append for uniqueness
 * @returns A slug string
 */
export const createGigSlug = (title: string, id?: string | number): string => {
  const slug = createSlug(title)
  return id ? `${slug}-${id}` : slug
}

/**
 * Extract ID from a slug (if present)
 * @param slug The slug to extract ID from
 * @returns The ID if found, otherwise null
 */
export const extractIdFromSlug = (slug: string): string | null => {
  const match = slug.match(/-(\d+)$/)
  return match ? match[1] : null
}
