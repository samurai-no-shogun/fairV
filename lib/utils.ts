/**
 * Utility Functions
 * 
 * Common utility functions used throughout the app.
 * Includes formatters, validators, and helper functions.
 * 
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 * 
 * @param inputs - Class names to merge
 * @returns Merged class string
 * 
 * @example
 * ```typescript
 * cn('px-4 py-2', condition && 'bg-blue-500', 'hover:bg-blue-600')
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price as USD currency
 * 
 * @param price - Price in dollars
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string (e.g., "$145.00")
 * 
 * @example
 * ```typescript
 * formatPrice(145) // "$145.00"
 * formatPrice(145.5, 0) // "$146"
 * ```
 */
export function formatPrice(price: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

/**
 * Format date for display
 * 
 * @param date - Date to format
 * @param format - Format style
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date()) // "Nov 8, 2025"
 * formatDate(new Date(), 'full') // "November 8, 2025"
 * formatDate(new Date(), 'time') // "2:05 PM"
 * ```
 */
export function formatDate(
  date: Date,
  format: 'short' | 'medium' | 'long' | 'full' | 'time' = 'medium'
): string {
  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit' },
  };
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(date);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 * 
 * @example
 * ```typescript
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * ```
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date, 'short');
}

/**
 * Format percentage
 * 
 * @param value - Value between 0 and 1
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * 
 * @example
 * ```typescript
 * formatPercentage(0.8) // "80%"
 * formatPercentage(0.833, 1) // "83.3%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M suffixes
 * 
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 * 
 * @example
 * ```typescript
 * formatCompactNumber(1500) // "1.5K"
 * formatCompactNumber(2300000) // "2.3M"
 * ```
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Validate email address format
 * 
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique ID
 * Simple UUID v4 generator
 * 
 * @returns UUID string
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Debounce function calls
 * Delays execution until after calls have stopped for specified time
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query) => search(query), 300);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 * Ensures function is only called once per specified time period
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay execution
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 * 
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamp number between min and max
 * 
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * 
 * @example
 * ```typescript
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50, 0, 100) // 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert File to base64 string
 * 
 * @param file - File to convert
 * @returns Promise resolving to base64 string
 * 
 * @example
 * ```typescript
 * const base64 = await fileToBase64(imageFile);
 * ```
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (data:image/jpeg;base64,)
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Compress image file
 * Reduces file size while maintaining quality
 * 
 * @param file - Image file to compress
 * @param maxWidth - Maximum width in pixels (default: 2048)
 * @param quality - JPEG quality 0-1 (default: 0.85)
 * @returns Promise resolving to compressed File
 * 
 * @example
 * ```typescript
 * const compressed = await compressImage(largeImage, 1920, 0.85);
 * ```
 */
export async function compressImage(
  file: File,
  maxWidth: number = 2048,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Set canvas size and draw image
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate percentage change between two values
 * 
 * @param oldValue - Original value
 * @param newValue - New value
 * @returns Percentage change (can be negative)
 * 
 * @example
 * ```typescript
 * calculatePercentageChange(100, 120) // 20.0 (20% increase)
 * calculatePercentageChange(120, 100) // -16.67 (16.67% decrease)
 * ```
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Safe JSON parse with fallback
 * 
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parse fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Copy text to clipboard
 * 
 * @param text - Text to copy
 * @returns Promise resolving to success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}

/**
 * Download data as file
 * 
 * @param data - Data to download
 * @param filename - Name of file
 * @param mimeType - MIME type (default: text/plain)
 * 
 * @example
 * ```typescript
 * downloadFile(csvData, 'export.csv', 'text/csv');
 * ```
 */
export function downloadFile(
  data: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = typeof data === 'string' ? new Blob([data], { type: mimeType }) : data;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get file extension from filename or MIME type
 * 
 * @param file - File object or filename
 * @returns File extension (e.g., "jpg", "png")
 */
export function getFileExtension(file: File | string): string {
  if (typeof file === 'string') {
    return file.split('.').pop()?.toLowerCase() || '';
  }
  
  // Try to get from filename
  const nameExt = file.name.split('.').pop()?.toLowerCase();
  if (nameExt) return nameExt;
  
  // Fallback to MIME type
  const mimeExtensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  
  return mimeExtensions[file.type] || '';
}

/**
 * Validate image file
 * 
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 10)
 * @returns Validation result
 * 
 * @example
 * ```typescript
 * const validation = validateImageFile(file);
 * if (!validation.valid) {
 *   console.error(validation.error);
 * }
 * ```
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please use JPG, PNG, WebP, or GIF.',
    };
  }
  
  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }
  
  return { valid: true };
}

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter of string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generate random color from string (consistent hash)
 * Useful for avatar colors, tag colors, etc.
 * 
 * @param str - String to hash
 * @returns HSL color string
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Check if code is running in browser
 * 
 * @returns True if in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if device is mobile
 * 
 * @returns True if mobile device
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Get device type
 * 
 * @returns Device type string
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (!isBrowser()) return 'desktop';
  
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Local storage helpers with type safety
 */
export const localStorage = {
  /**
   * Get item from local storage
   */
  getItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser()) return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  /**
   * Set item in local storage
   */
  setItem<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  /**
   * Remove item from local storage
   */
  removeItem(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
  },
  
  /**
   * Clear all items from local storage
   */
  clear(): void {
    if (!isBrowser()) return;
    window.localStorage.clear();
  },
};

/**
 * Error logging helper
 * Logs errors in development, sends to error tracking in production
 * 
 * @param error - Error to log
 * @param context - Additional context
 */
export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error]${context ? ` ${context}:` : ''}`, errorMessage);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  } else {
    // TODO: Send to error tracking service (Sentry, etc.)
    console.error(errorMessage);
  }
}
