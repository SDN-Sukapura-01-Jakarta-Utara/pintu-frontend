/**
 * Parse accessible_system from string format to array
 * Handles JSON string format like '["PINTU", "SIPERSA"]' or "{\"PINTU\", \"SIPERSA\"}"
 */
export function parseAccessibleSystem(systemString: string | any): string[] {
  console.log('[parseAccessibleSystem] Input:', systemString, 'Type:', typeof systemString)
  
  if (!systemString) {
    console.log('[parseAccessibleSystem] Input is empty, returning []')
    return []
  }
  
  // If already an array, return it
  if (Array.isArray(systemString)) {
    console.log('[parseAccessibleSystem] Input is already array:', systemString)
    return systemString
  }

  // If it's not a string, return empty array
  if (typeof systemString !== 'string') {
    console.log('[parseAccessibleSystem] Input is not string, returning []')
    return []
  }

  try {
    // Try to parse as JSON - replace single quotes with double quotes
    const converted = systemString.replace(/'/g, '"')
    console.log('[parseAccessibleSystem] After quote replacement:', converted)
    
    const parsed = JSON.parse(converted)
    console.log('[parseAccessibleSystem] After JSON.parse:', parsed)
    
    // Check if parsed result is an array
    if (Array.isArray(parsed)) {
      console.log('[parseAccessibleSystem] Final result (array):', parsed)
      return parsed
    }
    
    console.log('[parseAccessibleSystem] Parsed is not array, returning []')
    return []
  } catch (error) {
    console.error('[parseAccessibleSystem] ERROR:', error, 'Input was:', systemString)
    return []
  }
}

/**
 * Convert array to JSON string format for sending to API
 */
export function stringifyAccessibleSystem(systems: string[]): string {
  return JSON.stringify(systems)
}
