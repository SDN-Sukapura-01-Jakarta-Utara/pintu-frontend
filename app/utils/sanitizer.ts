/**
 * Security Utility: Sanitization Functions
 * Prevents XSS attacks by sanitizing user input and HTML content
 */

let DOMPurify: any = null

// Lazy load DOMPurify only in browser
const getDOMPurify = async () => {
  if (DOMPurify) return DOMPurify
  if (typeof window === 'undefined') return null
  
  try {
    DOMPurify = (await import('dompurify')).default
    return DOMPurify
  } catch (error) {
    console.error('Failed to load DOMPurify:', error)
    return null
  }
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes potentially dangerous scripts and event handlers
 * For rich text editor - allows safe HTML tags
 * 
 * @param dirty - Raw HTML string from user or API
 * @returns Sanitized HTML string (escaped if DOMPurify unavailable)
 */
export async function sanitizeHtml(dirty: string): Promise<string> {
  if (!dirty) return ''
  
  const purifier = await getDOMPurify()
  
  // Fallback to escape if DOMPurify not available (SSR)
  if (!purifier) return escapeHtml(dirty)
  
  return purifier.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code',
      'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'span', 'div', 'u', 'sub', 'sup'
    ],
    ALLOWED_ATTR: ['href', 'title', 'class', 'id', 'style'],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  })
}

/**
 * Sanitize plain text to prevent any HTML/XSS
 * Removes all HTML tags and only keeps text content
 * Use for: error messages, user names, titles
 * 
 * @param text - Text input from user or API
 * @returns Plain text string
 */
export async function sanitizeText(text: string): Promise<string> {
  if (!text) return ''
  
  const purifier = await getDOMPurify()
  
  // Fallback to escape if DOMPurify not available (SSR)
  if (!purifier) return escapeHtml(text)
  
  return purifier.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

/**
 * Escape special HTML characters
 * Converts HTML special characters to their entity equivalents
 * 
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  if (!text) return ''
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Validate and sanitize URL
 * Prevents javascript: and data: URL schemes
 * 
 * @param url - URL string to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url, window.location.origin)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return ''
    }
    
    return urlObj.toString()
  } catch {
    // If URL is not absolute, check if it's a relative path
    if (url.startsWith('/') || url.startsWith('?') || url.startsWith('#')) {
      return url
    }
    return ''
  }
}

/**
 * Sanitize user input for search/filter queries
 * Removes special characters that could break queries
 * 
 * @param input - User input string
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove HTML special chars
    .substring(0, 255) // Limit length to prevent buffer overflow
}

/**
 * Validate email address
 * Basic email validation to prevent injection attacks
 * 
 * @param email - Email string
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Synchronous text escape (lightweight, for most cases)
 * Don't use full DOMPurify for every field - too slow
 * Just escape HTML special characters
 */
function escapeSpecialChars(str: string): string {
  if (!str) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return str.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Sanitize object properties recursively
 * Used for sanitizing API responses - SYNCHRONOUS version
 * Escapes HTML special chars (fast, lightweight)
 * Don't use full sanitization here - too slow for large objects
 * 
 * @param obj - Object to sanitize
 * @param depth - Recursion depth limit
 * @returns Sanitized object with escaped strings
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  depth: number = 3
): T {
  if (depth <= 0) return obj
  
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Just escape, don't use full sanitization (too slow)
      sanitized[key] = escapeSpecialChars(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize objects
      sanitized[key] = sanitizeObject(value, depth - 1)
    } else if (Array.isArray(value)) {
      // Sanitize array items
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? escapeSpecialChars(item)
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item, depth - 1)
            : item
      )
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}
