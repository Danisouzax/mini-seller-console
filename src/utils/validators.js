export function isValidEmail(value) {
  // very basic email regex; good enough for this assignment
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}
