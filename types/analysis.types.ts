/**
 * Analysis Result Type Definitions
 * 
 * Types for AI analysis results and saved scan data.
 * 
 * @module types/analysis.types
 */

import type { TCGCard } from './tcg.types';

/**
 * Result from AI image analysis
 * Contains all data extracted from card photo
 * 
 * @interface AnalysisResult
 * 
 * @example
 * ```typescript
 * const result: AnalysisResult = {
 *   id: "scan-123",
 *   tcgCard: {
 *     cardName: "Charizard",
 *     setName: "Base Set",
 *     trendingPrice: 145.00,
 *     // ... other card data
 *   },
 *   imageUrl: "https://storage.googleapis.com/...",
 *   analyzedAt: new Date(),
 *   processingTime: 2.5
 * };
 * ```
 */
export interface AnalysisResult {
  /** Unique identifier for this analysis */
  id: string;
  
  /** Analyzed TCG card data */
  tcgCard: TCGCard;
  
  /** URL to the scanned card image */
  imageUrl?: string;
  
  /** Additional images provided by user */
  additionalImageUrls?: string[];
  
  /** When the analysis was performed */
  analyzedAt: Date;
  
  /** Processing time in seconds */
  processingTime?: number;
  
  /** Status of the analysis */
  status: AnalysisStatus;
  
  /** Error message if analysis failed */
  error?: string;
}

/**
 * Status of an analysis operation
 */
export type AnalysisStatus =
  | 'pending'    // Analysis in progress
  | 'complete'   // Successfully completed
  | 'error'      // Failed with error
  | 'partial';   // Completed but missing some data

/**
 * Saved analysis with bundling support
 * Extends AnalysisResult with persistence metadata
 */
export interface SavedAnalysis {
  /** Unique identifier (matches AnalysisResult.id) */
  id: string;
  
  /** The analysis result data */
  result: AnalysisResult;
  
  /** Path/URL to main card image */
  imagePath?: string;
  
  /** Count of additional images */
  additionalImageCount: number;
  
  /** When this analysis was saved */
  savedDate: Date;
  
  /** Whether this card is included in any bundle */
  isInBundle: boolean;
  
  /** IDs of bundles containing this card */
  bundleIDs: string[];
  
  /** User-added tags for organization */
  tags?: string[];
  
  /** Whether this scan is marked as favorite */
  isFavorite?: boolean;
}

/**
 * Request to re-analyze a card with additional context
 * Used when user adds more photos or edits condition details
 */
export interface ReanalysisRequest {
  /** ID of original analysis to update */
  originalAnalysisId: string;
  
  /** Additional images to include */
  additionalImages?: File[];
  
  /** User-provided context or corrections */
  userContext?: string;
  
  /** Condition adjustments */
  conditionAdjustments?: {
    centeringScore?: string;
    cornerCondition?: string;
    edgeCondition?: string;
    surfaceCondition?: string;
  };
}

/**
 * AI analysis request payload
 * Sent to OpenAI Vision API
 */
export interface AIAnalysisRequest {
  /** Base64-encoded image data */
  imageData: string;
  
  /** Additional images (max 3) */
  additionalImages?: string[];
  
  /** Previous analysis to refine (if re-analyzing) */
  previousAnalysis?: AnalysisResult;
  
  /** Additional context from user */
  userContext?: string;
  
  /** Preferred TCG type if known */
  expectedTCGType?: string;
}

/**
 * Raw response from OpenAI API
 * Parsed into AnalysisResult
 */
export interface AIRawResponse {
  /** Card identification */
  itemName: string;
  category?: string;
  
  /** TCG-specific fields */
  cardSet?: string;
  cardNumber?: string;
  rarity?: string;
  printVariant?: string;
  gradingPotential?: string;
  
  /** Pricing (may be AI estimates, refined by eBay data) */
  trendingPrice?: number;
  averagePrice?: number;
  lowPrice?: number;
  
  /** Condition assessment */
  conditionDescription?: string;
  conditionRating?: string;
  centeringScore?: string;
  cornerCondition?: string;
  edgeCondition?: string;
  surfaceCondition?: string;
  
  /** Authentication */
  authenticityScore?: number;
  authenticityNotes?: string;
  
  /** Metadata */
  keywords?: string[];
  priceCitations?: string[];
}

/**
 * Analysis processing state
 * Used for UI loading/progress indicators
 */
export interface AnalysisState {
  /** Current step in analysis process */
  step: AnalysisStep;
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Human-readable status message */
  message: string;
  
  /** Whether analysis is in progress */
  isProcessing: boolean;
  
  /** Result when complete */
  result?: AnalysisResult;
  
  /** Error if failed */
  error?: string;
}

/**
 * Steps in the analysis process
 * Used for progress indication
 */
export type AnalysisStep =
  | 'capturing'     // Taking photo
  | 'uploading'     // Uploading image
  | 'analyzing'     // AI analysis in progress
  | 'pricing'       // Fetching market prices
  | 'complete'      // Analysis complete
  | 'error';        // Failed

/**
 * History filter options
 * For searching/filtering saved analyses
 */
export interface HistoryFilters {
  /** Search by card name */
  searchQuery?: string;
  
  /** Filter by TCG type */
  tcgType?: string;
  
  /** Filter by set name */
  setName?: string;
  
  /** Filter by price range */
  priceRange?: {
    min: number;
    max: number;
  };
  
  /** Filter by condition */
  condition?: string;
  
  /** Filter by date range */
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  /** Only show favorites */
  favoritesOnly?: boolean;
  
  /** Only show unbundled cards */
  unbundledOnly?: boolean;
}

/**
 * Sort options for history view
 */
export type HistorySortOption =
  | 'date-desc'      // Newest first
  | 'date-asc'       // Oldest first
  | 'price-desc'     // Highest price first
  | 'price-asc'      // Lowest price first
  | 'name-asc'       // Alphabetical
  | 'name-desc';     // Reverse alphabetical

/**
 * Configuration for history view
 */
export interface HistoryViewConfig {
  /** How to sort results */
  sortBy: HistorySortOption;
  
  /** Active filters */
  filters: HistoryFilters;
  
  /** Number of items per page */
  itemsPerPage: number;
  
  /** Current page number */
  currentPage: number;
  
  /** View mode (grid or list) */
  viewMode: 'grid' | 'list';
}
