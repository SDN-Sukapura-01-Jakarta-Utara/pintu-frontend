/**
 * Parse and format role names from role array
 * @param roles - Array of role objects with 'name' property
 * @returns Formatted role names separated by comma
 * 
 * @example
 * parseRoleName([{name: 'Admin'}, {name: 'User'}])
 * // Returns: "Admin, User"
 */
export const parseRoleName = (roles: any[]): string => {
  if (!roles || roles.length === 0) return '-'
  
  try {
    return roles
      .map(role => role.name)
      .filter(name => name)
      .join(', ')
  } catch {
    return '-'
  }
}
