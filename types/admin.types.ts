/**
 * Admin Dashboard Type Definitions
 * 
 * Types for admin-only market research features and analytics.
 * Only accessible to authenticated admin users.
 * 
 * @module types/admin.types
 */

import type { TCGCard, ConditionRating } from './tcg.types';

/**
 * Admin dashboard statistics overview
 * Provides high-level metrics about the research database
 */
export interface AdminDashboardStats {
  /** Total number of card scans in database */
  totalScans: number;
  
  /** Number of unique cards cataloged */
  uniqueCards: number;
  
  /** Number of users contributing data (always 1 for admin-only) */
  totalUsers: number;
  
  /** Database storage size (formatted string) */
  databaseSize: string;
  
  /** Average price point across all scans */
  averagePricePoint: number;
  
  /** Top scanned cards by frequency */
  topScannedCards: CardScanCount[];
  
  /** Most recent scans */
  recentScans: RecentScan[];
  
  /** Date range of data */
  dataRange: {
    firstScan: Date;
    lastScan: Date;
  };
}

/**
 * Card scan frequency data
 * Shows which cards are scanned most often
 */
export interface CardScanCount {
  /** Unique identifier */
  id: string;
  
  /** Card name */
  cardName: string;
  
  /** Set name */
  setName: string;
  
  /** Number of times this card has been scanned */
  scanCount: number;
  
  /** Average price across all scans */
  averagePrice: number;
  
  /** Price range (min - max) */
  priceRange: string;
  
  /** Price trend indicator */
  trend: 'Rising' | 'Falling' | 'Stable';
  
  /** Trend percentage (e.g., +8.3% or -2.1%) */
  trendPercentage?: number;
}

/**
 * Recent scan entry for activity feed
 */
export interface RecentScan {
  /** Unique identifier */
  id: string;
  
  /** Card name */
  cardName: string;
  
  /** When scanned */
  scanDate: Date;
  
  /** Price at time of scan */
  price: number;
  
  /** Condition rating */
  condition: string;
  
  /** Set name */
  setName?: string;
}

/**
 * Market insight derived from research data
 * Automated analysis of trends and patterns
 */
export interface MarketInsight {
  /** Unique identifier */
  id: string;
  
  /** Insight title */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Impact level */
  impact: InsightImpact;
  
  /** Category of insight */
  category: InsightCategory;
  
  /** Number of data points analyzed */
  dataPoints: number;
  
  /** Confidence level (0.0 to 1.0) */
  confidence: number;
  
  /** When insight was generated */
  generatedAt: Date;
  
  /** Supporting data/evidence */
  evidence?: string[];
}

/**
 * Impact level of a market insight
 */
export type InsightImpact = 'High' | 'Medium' | 'Low';

/**
 * Categories of market insights
 */
export type InsightCategory =
  | 'Price Trend'              // Price movement analysis
  | 'Rarity Impact'            // How rarity affects value
  | 'Condition Effect'         // Condition correlation with price
  | 'Set Popularity'           // Which sets are most valuable
  | 'Authentication Pattern'   // Counterfeit detection insights
  | 'Print Variant Value';     // Variant price differentials

/**
 * Market trend data for a specific card
 * Shows price movement over time
 */
export interface CardMarketTrend {
  /** Card identifier */
  cardIdentifier: string;
  
  /** Card name */
  cardName: string;
  
  /** Historical price data points */
  priceHistory: CardPriceHistoryPoint[];
  
  /** 7-day price change percentage */
  priceChange7d: number;
  
  /** 30-day price change percentage */
  priceChange30d: number;
  
  /** Current trend direction */
  trendDirection: 'Up' | 'Down' | 'Stable';
  
  /** Volatility score (0-100, higher = more volatile) */
  volatility: number;
}

/**
 * Single point in card price history
 */
export interface CardPriceHistoryPoint {
  /** Date of data point */
  date: Date;
  
  /** Average price on this date */
  price: number;
  
  /** Volume of sales */
  volume: number;
  
  /** Source of data */
  source: string;
}

/**
 * Admin authentication status
 */
export interface AdminAuthStatus {
  /** Whether user is authenticated as admin */
  isAdmin: boolean;
  
  /** Admin user ID */
  adminUID?: string;
  
  /** Authentication method used */
  authMethod: 'uid' | 'code' | 'none';
  
  /** When admin session started */
  sessionStart?: Date;
}

/**
 * Data export options
 */
export interface DataExportOptions {
  /** Format to export to */
  format: 'csv' | 'json' | 'excel';
  
  /** Date range to export */
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  /** Which data to include */
  includeFields: ExportField[];
  
  /** Whether to include price history */
  includePriceHistory: boolean;
  
  /** Whether to include market statistics */
  includeStatistics: boolean;
}

/**
 * Fields available for data export
 */
export type ExportField =
  | 'cardName'
  | 'setName'
  | 'cardNumber'
  | 'rarity'
  | 'condition'
  | 'trendingPrice'
  | 'averagePrice'
  | 'lowPrice'
  | 'scanDate'
  | 'gradingPotential'
  | 'authenticityScore';

/**
 * Result of data export operation
 */
export interface ExportResult {
  /** Whether export was successful */
  success: boolean;
  
  /** URL to download exported file */
  downloadUrl?: string;
  
  /** Number of records exported */
  recordCount?: number;
  
  /** File size in bytes */
  fileSize?: number;
  
  /** Error message if failed */
  error?: string;
}

/**
 * Analytics query parameters
 * For generating custom reports
 */
export interface AnalyticsQuery {
  /** Start date for analysis */
  startDate: Date;
  
  /** End date for analysis */
  endDate: Date;
  
  /** Metric to analyze */
  metric: AnalyticsMetric;
  
  /** Group results by */
  groupBy?: 'day' | 'week' | 'month' | 'set' | 'rarity' | 'condition';
  
  /** Filters to apply */
  filters?: {
    tcgType?: string;
    setName?: string;
    priceRange?: { min: number; max: number };
  };
}

/**
 * Metrics available for analytics
 */
export type AnalyticsMetric =
  | 'scan_volume'       // Number of scans over time
  | 'avg_price'         // Average price trends
  | 'price_distribution' // Price distribution analysis
  | 'condition_impact'  // How condition affects price
  | 'rarity_correlation' // Rarity vs price correlation
  | 'set_popularity';   // Most scanned sets

/**
 * Result of analytics query
 */
export interface AnalyticsResult {
  /** Query that generated this result */
  query: AnalyticsQuery;
  
  /** Data points */
  dataPoints: AnalyticsDataPoint[];
  
  /** Summary statistics */
  summary: {
    total: number;
    average: number;
    min: number;
    max: number;
    median?: number;
  };
  
  /** Generated insights */
  insights: string[];
}

/**
 * Single data point in analytics result
 */
export interface AnalyticsDataPoint {
  /** Label for this data point (date, category, etc.) */
  label: string;
  
  /** Value */
  value: number;
  
  /** Additional context */
  metadata?: Record<string, any>;
}

/**
 * Database health metrics
 * For monitoring database performance
 */
export interface DatabaseHealthMetrics {
  /** Total records in database */
  totalRecords: number;
  
  /** Database size in MB */
  sizeInMB: number;
  
  /** Average query time in ms */
  avgQueryTime: number;
  
  /** Number of indexes */
  indexCount: number;
  
  /** Last optimization date */
  lastOptimized?: Date;
  
  /** Health status */
  status: 'Healthy' | 'Warning' | 'Critical';
  
  /** Recommendations */
  recommendations: string[];
}
