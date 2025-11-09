/**
 * Card Bundle Type Definitions
 * 
 * Type definitions for bundling multiple TCG cards together
 * for combined pricing and negotiation.
 * 
 * @module types/bundle.types
 */

import type { TCGCard } from './tcg.types';

/**
 * Pricing strategy for bundle calculations
 * Determines which price tier to use for each card
 */
export type PricingStrategy = 
  | 'trending'  // Use trending prices (most recent sales)
  | 'average'   // Use average prices (30-day mean)
  | 'low';      // Use low prices (best deals)

/**
 * Represents a bundle of multiple TCG cards
 * 
 * Bundles allow users to group cards and calculate total value
 * using different pricing strategies and percentage multipliers.
 * This is the core feature for bulk negotiations.
 * 
 * @interface CardBundle
 * 
 * @example
 * ```typescript
 * const bundle: CardBundle = {
 *   id: "bundle-123",
 *   name: "Charizard Collection",
 *   cardIDs: ["card-1", "card-2", "card-3"],
 *   pricingStrategy: "average",
 *   percentageMultiplier: 0.80,  // 80% of market value
 *   calculatedTotal: 450.00,
 *   createdAt: new Date(),
 *   lastModified: new Date()
 * };
 * ```
 */
export interface CardBundle {
  /** Unique identifier for this bundle */
  id: string;
  
  /** User-defined bundle name */
  name: string;
  
  /** 
   * Array of card IDs included in this bundle
   * References to TCGCard.id values
   * No limit on bundle size
   */
  cardIDs: string[];
  
  /** 
   * Pricing strategy to use for calculations
   * Determines which price tier (trending/average/low) to sum
   */
  pricingStrategy: PricingStrategy;
  
  /** 
   * Percentage multiplier for final price (0.1 to 1.0)
   * Allows pricing at 10%-100% of market value
   * Common use: 80% for bulk deals, 90% for near-market, etc.
   */
  percentageMultiplier: number;
  
  /** 
   * Calculated total value of bundle
   * Sum of all cards at selected strategy * multiplier
   */
  calculatedTotal: number;
  
  /** Optional notes about the bundle */
  notes?: string;
  
  /** When the bundle was created */
  createdAt: Date;
  
  /** Last time bundle was modified */
  lastModified: Date;
}

/**
 * Statistics for a bundle showing all pricing options
 * Used to display comparison of different strategies
 */
export interface BundleStatistics {
  /** Total if using trending prices */
  trendingTotal: number;
  
  /** Total if using average prices */
  averageTotal: number;
  
  /** Total if using low prices */
  lowTotal: number;
  
  /** Total with current strategy and multiplier applied */
  selectedTotal: number;
  
  /** Number of cards in bundle */
  cardCount: number;
  
  /** Number of cards with valid pricing data */
  validCardCount: number;
}

/**
 * Calculate bundle total based on cards, strategy, and multiplier
 * 
 * This is the core calculation function for the bundle feature.
 * It sums card prices according to the selected pricing strategy
 * and applies the percentage multiplier.
 * 
 * @param cards - Array of TCG cards in the bundle
 * @param strategy - Which price tier to use
 * @param multiplier - Percentage multiplier (0.1 to 1.0)
 * @returns Calculated total in USD
 * 
 * @throws {Error} If multiplier is out of range
 * 
 * @example
 * ```typescript
 * const total = calculateBundleTotal(
 *   [card1, card2, card3],
 *   'average',
 *   0.80  // 80% of market value
 * );
 * // Returns: 360.00 (if cards total $450 at average)
 * ```
 */
export function calculateBundleTotal(
  cards: TCGCard[],
  strategy: PricingStrategy,
  multiplier: number
): number {
  // Validate multiplier
  if (multiplier < 0.1 || multiplier > 1.0) {
    throw new Error('Multiplier must be between 0.1 and 1.0 (10% to 100%)');
  }
  
  // Sum prices based on strategy
  const subtotal = cards.reduce((sum, card) => {
    const price = getPriceForStrategy(card, strategy);
    return sum + (price ?? 0);
  }, 0);
  
  // Apply percentage multiplier
  return subtotal * multiplier;
}

/**
 * Get price from card for specific strategy
 * 
 * @param card - TCG card
 * @param strategy - Pricing strategy to use
 * @returns Price value or undefined if not available
 * 
 * @private
 */
function getPriceForStrategy(
  card: TCGCard,
  strategy: PricingStrategy
): number | undefined {
  switch (strategy) {
    case 'trending':
      return card.trendingPrice;
    case 'average':
      return card.averagePrice;
    case 'low':
      return card.lowPrice;
    default:
      return undefined;
  }
}

/**
 * Calculate comprehensive statistics for a bundle
 * Shows what the bundle would cost under each pricing strategy
 * 
 * @param bundle - Card bundle to analyze
 * @param cards - All available cards (for lookup)
 * @returns Bundle statistics with all pricing options
 * 
 * @example
 * ```typescript
 * const stats = calculateBundleStatistics(bundle, allCards);
 * console.log(stats.averageTotal);  // $450.00
 * console.log(stats.trendingTotal); // $520.00
 * console.log(stats.selectedTotal); // $360.00 (80% of average)
 * ```
 */
export function calculateBundleStatistics(
  bundle: CardBundle,
  cards: TCGCard[]
): BundleStatistics {
  // Find cards that are in this bundle
  const bundleCards = cards.filter(card => bundle.cardIDs.includes(card.id));
  
  // Calculate totals for each strategy
  let trendingTotal = 0;
  let averageTotal = 0;
  let lowTotal = 0;
  let validCards = 0;
  
  for (const card of bundleCards) {
    if (card.trendingPrice !== undefined) {
      trendingTotal += card.trendingPrice;
      validCards++;
    }
    if (card.averagePrice !== undefined) {
      averageTotal += card.averagePrice;
    }
    if (card.lowPrice !== undefined) {
      lowTotal += card.lowPrice;
    }
  }
  
  return {
    trendingTotal,
    averageTotal,
    lowTotal,
    selectedTotal: bundle.calculatedTotal,
    cardCount: bundle.cardIDs.length,
    validCardCount: validCards,
  };
}

/**
 * Update bundle total when cards or settings change
 * 
 * @param bundle - Bundle to update
 * @param cards - Current card data
 * @returns Updated bundle with new total
 * 
 * @example
 * ```typescript
 * const updatedBundle = updateBundleTotal(bundle, cards);
 * ```
 */
export function updateBundleTotal(
  bundle: CardBundle,
  cards: TCGCard[]
): CardBundle {
  const bundleCards = cards.filter(card => bundle.cardIDs.includes(card.id));
  
  const newTotal = calculateBundleTotal(
    bundleCards,
    bundle.pricingStrategy,
    bundle.percentageMultiplier
  );
  
  return {
    ...bundle,
    calculatedTotal: newTotal,
    lastModified: new Date(),
  };
}

/**
 * Pricing strategy metadata
 * Provides display information and descriptions
 */
export const PRICING_STRATEGIES = {
  trending: {
    label: 'Trending',
    description: 'Most Recent Sales (7 days)',
    icon: '📈',
    color: 'text-green-600',
  },
  average: {
    label: 'Average',
    description: 'Average Price (30 days)',
    icon: '📊',
    color: 'text-blue-600',
  },
  low: {
    label: 'Low End',
    description: 'Lowest Sale (30 days)',
    icon: '📉',
    color: 'text-orange-600',
  },
} as const;

/**
 * Format percentage for display
 * 
 * @param multiplier - Multiplier value (0.1 to 1.0)
 * @returns Formatted percentage string (e.g., "80%")
 */
export function formatPercentage(multiplier: number): string {
  return `${Math.round(multiplier * 100)}%`;
}

/**
 * Validate bundle before saving
 * 
 * @param bundle - Bundle to validate
 * @returns Validation result with any errors
 */
export function validateBundle(bundle: CardBundle): BundleValidation {
  const errors: string[] = [];
  
  if (!bundle.name.trim()) {
    errors.push('Bundle name is required');
  }
  
  if (bundle.cardIDs.length === 0) {
    errors.push('Bundle must contain at least one card');
  }
  
  if (bundle.percentageMultiplier < 0.1 || bundle.percentageMultiplier > 1.0) {
    errors.push('Percentage must be between 10% and 100%');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Result of bundle validation
 */
export interface BundleValidation {
  /** Whether the bundle is valid */
  isValid: boolean;
  
  /** Array of validation error messages */
  errors: string[];
}
