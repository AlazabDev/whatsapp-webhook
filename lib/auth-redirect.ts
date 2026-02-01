export const getSafeRedirect = (value: string | null | undefined, fallback = "/") => {
  if (!value) return fallback
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value
  }
  return fallback
}
