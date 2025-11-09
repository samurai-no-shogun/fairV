/**
 * TCG Card Type Definitions
 * 
 * Core type definitions for Trading Card Game cards.
 * These types form the foundation of the pricing and analysis system.
 * 
 * @module types/tcg.types
 */

/**
 * Represents a Trading Card Game card with complete market and condition data.
 * 
 * This is the primary data structure used throughout the app for representing
 * scanned TCG cards. It includes identification details, pricing information,
 * condition assessment, and metadata.
 * 
 * @interface TCGCard
 * 
 * @example
 * ```typescript
 * const card: TCGCard = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   cardName: "Charizard",
 *   setName: "Base Set",
 *   cardNumber: "4/102",
 *   rarity: "Rare Holo",
 *   printVariant: "1st Edition Shadowless",
 *   trendingPrice: 145.00,
 *   averagePrice: 128.29,
 *   lowPrice: 100.00,
 *   conditionRating: "Near Mint",
 *   gradingPotential: "PSA 8-9"
 * };
 * ```
 */
export interface TCGCard {
  /** Unique identifier for this card instance */
  id: string;
  
  // MARK: - Card Identification
  
  /** Exact card name as it appears on the card */
  cardName: string;
  
  /** Set name (e.g., "Base Set", "Evolving Skies") */
  setName?: string;
  
  /** Card number in set (e.g., "4/102", "SWSH001") */
  cardNumber?: string;
  
  /** Rarity designation (e.g., "Rare Holo", "Secret Rare") */
  rarity?: string;
  
  /** TCG type (e.g., "Pokemon", "Yu-Gi-Oh!", "MTG") */
  tcgType?: TCGType;
  
  // MARK: - Print Variations
  
  /** 
   * Print variant information
   * Critical for accurate pricing as variants can differ by 10-100x in value
   * Examples: "1st Edition", "Shadowless", "Reverse Holo", "Full Art"
   */
  printVariant?: string;
  
  /** Language of the card (default: "English") */
  language: string;
  
  // MARK: - Pricing Data (Core Feature)
  
  /** 
   * Trending price: Average of most recent sales (last 7 days)
   * Used for negotiating with current market conditions
   */
  trendingPrice?: number;
  
  /** 
   * Average price: Mean of all sales in last 30 days
   * Best indicator of stable market value
   */
  averagePrice?: number;
  
  /** 
   * Low price: Minimum sale price in last 30 days
   * Used for finding deals or setting minimum offers
   */
  lowPrice?: number;
  
  /** Timestamp of when pricing data was last updated */
  priceLastUpdated?: Date;
  
  /** Source of pricing data (e.g., "eBay", "TCGPlayer") */
  priceSource?: string;
  
  // MARK: - Condition Assessment
  
  /** 
   * Overall condition rating
   * Standard: "Near Mint", "Lightly Played", "Moderately Played", 
   *           "Heavily Played", "Damaged"
   */
  conditionRating?: ConditionRating;
  
  /** Detailed condition description from AI analysis */
  conditionDescription?: string;
  
  /** 
   * Centering assessment for grading potential
   * Format: "50/50" (perfect) to "70/30" (off-center)
   */
  centeringScore?: string;
  
  /** Corner condition details (e.g., "Sharp corners, minor whitening bottom-right") */
  cornerCondition?: string;
  
  /** Edge condition details (e.g., "Clean edges, no chipping") */
  edgeCondition?: string;
  
  /** Surface condition details (e.g., "Holo pattern intact, light scratches") */
  surfaceCondition?: string;
  
  // MARK: - Grading & Authentication
  
  /** 
   * Estimated professional grading potential
   * Format: "PSA 8-9" or "BGS 9-9.5"
   */
  gradingPotential?: string;
  
  /** 
   * AI confidence score for authenticity (0.0 to 1.0)
   * > 0.9: High confidence authentic
   * 0.7-0.9: Likely authentic
   * < 0.7: Needs expert verification
   */
  authenticityScore?: number;
  
  /** Notes about authentication concerns, if any */
  authenticityNotes?: string;
  
  // MARK: - Metadata
  
  /** Timestamp when card was scanned */
  scannedAt: Date;
  
  /** URL to stored card image */
  imageUrl?: string;
  
  /** Additional user notes */
  userNotes?: string;
}

/**
 * Trading Card Game types supported by the app
 */
export type TCGType = 
  | 'Pokemon'
  | 'Yu-Gi-Oh!'
  | 'Magic: The Gathering'
  | 'Sports Card'
  | 'Other';

/**
 * Standard condition ratings for TCG cards
 * Based on industry-standard grading terminology
 */
export type ConditionRating =
  | 'Near Mint'        // Mint or near-mint condition
  | 'Lightly Played'   // Minor wear from play
  | 'Moderately Played' // Obvious wear but complete
  | 'Heavily Played'   // Significant wear
  | 'Damaged';         // Major damage

/**
 * Represents a single data point in price history
 * Used for tracking price trends over time
 */
export interface PriceDataPoint {
  /** Price in USD */
  price: number;
  
  /** Date of sale/listing */
  date: Date;
  
  /** Source of the price (e.g., "eBay", "TCGPlayer") */
  source: string;
  
  /** Condition at time of sale */
  condition?: ConditionRating;
  
  /** Whether this was a graded card sale */
  wasGraded?: boolean;
  
  /** Grade if applicable (e.g., "PSA 10") */
  grade?: string;
}

/**
 * Price statistics calculated from historical data
 * Powers the 3-tier pricing system
 */
export interface PriceStatistics {
  /** Trending: Average of last 3 sales (7 days) */
  trending: number;
  
  /** Average: Mean of all sales (30 days) */
  average: number;
  
  /** Low: Minimum sale (30 days) */
  low: number;
  
  /** High: Maximum sale (30 days) */
  high?: number;
  
  /** Number of sales analyzed */
  sampleSize: number;
  
  /** Date range of data (e.g., "Last 30 days") */
  dataRange: string;
  
  /** Price trend indicator (-1 to 1, negative = falling, positive = rising) */
  trendDirection?: number;
}

/**
 * Represents a single row in the price reference table
 * Shows card value at specific percentage of market price
 */
export interface PriceTableRow {
  /** Percentage of base price (10, 20, 30, ... 100) */
  percentage: number;
  
  /** Value at this percentage of trending price */
  trendingValue: number;
  
  /** Value at this percentage of average price */
  averageValue: number;
  
  /** Value at this percentage of low price */
  lowValue: number;
}

/**
 * Generate price table rows for display
 * Creates 10 rows showing 10%-100% of card values
 * 
 * @param card - TCG card with pricing data
 * @returns Array of price table rows
 * 
 * @example
 * ```typescript
 * const table = generatePriceTable(card);
 * // Returns 10 rows: [100%, 90%, 80%, ... 10%]
 * ```
 */
export function generatePriceTable(card: TCGCard): PriceTableRow[] {
  const percentages = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  
  return percentages.map(percentage => {
    const multiplier = percentage / 100;
    
    return {
      percentage,
      trendingValue: (card.trendingPrice ?? 0) * multiplier,
      averageValue: (card.averagePrice ?? 0) * multiplier,
      lowValue: (card.lowPrice ?? 0) * multiplier,
    };
  });
}

/**
 * Format price for display
 * 
 * @param price - Price in dollars
 * @returns Formatted string (e.g., "$145.00")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Get unique card identifier for database lookups
 * Format: "CardName|SetName|CardNumber"
 * 
 * @param card - TCG card
 * @returns Unique identifier string
 */
export function getCardIdentifier(card: TCGCard): string {
  const name = card.cardName.trim();
  const set = card.setName?.trim() ?? '';
  const number = card.cardNumber?.trim() ?? '';
  
  return `${name}|${set}|${number}`;
}
