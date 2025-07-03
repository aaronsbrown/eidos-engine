// AIDEV-NOTE: Simple preset name validation for security and usability
// Prevents XSS and ensures reasonable name lengths

/**
 * Clean and validate preset name for security and usability
 * @param name - Raw preset name from user input
 * @returns Cleaned and validated name, or null if invalid
 */
export function validatePresetName(name: string): string | null {
  if (!name || typeof name !== 'string') {
    return null
  }

  // Trim whitespace
  const trimmed = name.trim()
  
  // Check length (1-50 characters)
  if (trimmed.length === 0 || trimmed.length > 50) {
    return null
  }
  
  // Remove any script tags or HTML (basic XSS prevention)
  const cleaned = trimmed
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
  
  // Final check - make sure we still have something left
  if (cleaned.trim().length === 0) {
    return null
  }
  
  return cleaned.trim()
}

/**
 * Check if preset name is valid without cleaning it
 * @param name - Preset name to validate
 * @returns true if name is valid
 */
export function isValidPresetName(name: string): boolean {
  return validatePresetName(name) !== null
}