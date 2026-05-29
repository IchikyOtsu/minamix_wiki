/** Sanitizes a filename (base + extension), no uniqueness suffix. */
export function sanitizeName(original: string): string {
  const lastDot = original.lastIndexOf('.')
  const base = lastDot > 0 ? original.slice(0, lastDot) : original
  const ext = lastDot > 0 ? original.slice(lastDot).toLowerCase() : ''

  const cleanBase = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'

  return `${cleanBase}${ext}`
}

/** Sanitizes and adds a 4-char random suffix to avoid storage collisions. */
export function sanitizeFilename(original: string): string {
  const clean = sanitizeName(original)
  const lastDot = clean.lastIndexOf('.')
  const base = lastDot > 0 ? clean.slice(0, lastDot) : clean
  const ext = lastDot > 0 ? clean.slice(lastDot) : ''
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}${ext}`
}
