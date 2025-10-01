/**
 * Application Constants
 *
 * Centralized configuration constants used throughout the application.
 * Prefer importing these over hardcoded values for maintainability.
 */

// Cache and Performance Constants
export const CACHE_DURATION = {
  /** Page revalidation interval in seconds (1 hour) */
  PAGE_REVALIDATE: 3600,
  /** API cache duration for population data */
  API_CACHE: 300, // 5 minutes
} as const;

// UI and Display Constants
export const UI_DEFAULTS = {
  /** Default fallback scores for groups when optimization data unavailable */
  FALLBACK_GROUP_SCORES: [45, 30, 25] as const,
  /** Maximum number of optimization groups */
  MAX_GROUPS: 3,
  /** Default color scheme order */
  COLOR_PRIORITY: ["gold", "silver", "bronze"] as const,
} as const;

// Algorithm Constants
export const ALGORITHM = {
  /** Default maximum groups for partition optimization */
  DEFAULT_MAX_GROUPS: 3,
  /** Performance logging thresholds */
  LOG_THRESHOLDS: {
    SLOW_OPERATION_MS: 1000,
    MEMORY_WARNING_MB: 100,
  },
} as const;
