/**
 * Simple Encryption Utilities
 * Uses Web Crypto API for browser-native encryption
 * 
 * Note: This provides obfuscation, not military-grade security.
 * The encryption key is derived from a user-provided password.
 * Without the password, data cannot be easily read.
 */

// Use a fixed salt for key derivation (app-specific)
const SALT = new Uint8Array([
  0x46, 0x61, 0x6d, 0x69, 0x6c, 0x79, 0x4f, 0x72,
  0x67, 0x61, 0x6e, 0x69, 0x7a, 0x65, 0x72, 0x21
]) // "FamilyOrganizer!"

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12

/**
 * Derive an encryption key from a password
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  // Derive the actual encryption key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt a string with a password
 */
export async function encrypt(plaintext: string, password: string): Promise<string> {
  if (!password) {
    throw new Error('Password is required for encryption')
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

  // Derive key and encrypt
  const key = await deriveKey(password)
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  )

  // Combine IV + encrypted data and encode as base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypt a string with a password
 */
export async function decrypt(ciphertext: string, password: string): Promise<string> {
  if (!password) {
    throw new Error('Password is required for decryption')
  }

  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(ciphertext).split('').map(c => c.charCodeAt(0))
    )

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH)
    const encrypted = combined.slice(IV_LENGTH)

    // Derive key and decrypt
    const key = await deriveKey(password)
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch {
    throw new Error('Decryption failed - incorrect password or corrupted data')
  }
}

/**
 * Check if Web Crypto API is available
 */
export function isEncryptionSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.encrypt === 'function'
}

/**
 * Hash a string (for PIN storage, etc.)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input + 'FamilyOrganizerSalt')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

/**
 * Verify a string against a hash
 */
export async function verifyHash(input: string, hash: string): Promise<boolean> {
  const inputHash = await hashString(input)
  return inputHash === hash
}

/**
 * Simple obfuscation for less sensitive data (no password required)
 * This is NOT encryption - just makes data harder to read casually
 */
export function obfuscate(data: string): string {
  // Simple XOR with a fixed key + base64
  const key = 'FamilyOrganizer2024'
  let result = ''
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return btoa(result)
}

/**
 * Reverse obfuscation
 */
export function deobfuscate(data: string): string {
  try {
    const decoded = atob(data)
    const key = 'FamilyOrganizer2024'
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      )
    }
    return result
  } catch {
    return data // Return as-is if not obfuscated
  }
}
