export function toSlugBase(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['`”’“]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '-')
    .replace(/-+/g, '-')
}

export async function generateUniqueSlug(
  baseText: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = toSlugBase(baseText) || 'item'
  let candidate = base
  let suffix = 2
  while (await exists(candidate)) {
    candidate = `${base}-${suffix++}`
  }
  return candidate
}


