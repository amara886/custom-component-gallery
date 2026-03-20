/**
 * Converts a base64 string to an ArrayBuffer.
 * Handles base64 strings with or without a data URL prefix.
 *
 * Note: The docx-preview library only supports .docx files (Office Open XML).
 * It does not support the older .doc format.
 *
 * @param base64 The base64 encoded string.
 * @returns The decoded ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (!base64) {
    throw new Error('Base64 string is empty or undefined');
  }

  try {
    // Remove data URL prefix if present
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

    if (!base64Data) {
      throw new Error('Invalid base64 format - no data after comma');
    }

    const binaryString = window.atob(base64Data);
    const len = binaryString.length;

    if (len === 0) {
      throw new Error('Decoded base64 string is empty');
    }

    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    if (error instanceof DOMException) {
      throw new Error('Invalid base64 encoding - failed to decode');
    }
    throw error; // Re-throw other errors
  }
}
