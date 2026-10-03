/**
 * ChatGPT MCP App UI state ids.
 * @see tasks/chatgpt-plugin/design-state-graph.md
 * @see backend CONSUMER_OFFER_STATUS for offer lifecycle overlap
 */

/** UI-only and lifecycle states for the consumer plugin surface. */
export const UI_STATE_ID = {
  DISCONNECTED: 'disconnected',
  LOADING: 'loading',
  NO_MATCH: 'no_match',
  ELIGIBLE: 'eligible',
  DRAFT: 'draft',
  PREVIEW: 'preview',
  CONFIRMING: 'confirming',
  SUBMITTING: 'submitting',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COUNTERED: 'countered',
  DECLINED: 'declined',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  STALE_INVENTORY: 'stale_inventory',
  STALE_PRICE: 'stale_price',
  CHECKOUT_HANDOFF: 'checkout_handoff',
  CHECKOUT_FAILED: 'checkout_failed',
  PURCHASED: 'purchased',
} as const

export type UiStateId = (typeof UI_STATE_ID)[keyof typeof UI_STATE_ID]

/**
 * Maps overlapping states to backend shopper offer status vocabulary.
 * UI-only states are omitted.
 */
export const UI_STATE_TO_CONSUMER_OFFER_STATUS: Partial<
  Record<UiStateId, ConsumerOfferStatus>
> = {
  [UI_STATE_ID.DRAFT]: 'draft',
  [UI_STATE_ID.PREVIEW]: 'preview',
  [UI_STATE_ID.PENDING]: 'pending',
  [UI_STATE_ID.ACCEPTED]: 'accepted',
  [UI_STATE_ID.COUNTERED]: 'countered',
  [UI_STATE_ID.DECLINED]: 'declined',
  [UI_STATE_ID.CANCELED]: 'canceled',
  [UI_STATE_ID.EXPIRED]: 'expired',
  [UI_STATE_ID.CHECKOUT_HANDOFF]: 'checkout_ready',
  [UI_STATE_ID.CHECKOUT_FAILED]: 'checkout_failed',
  [UI_STATE_ID.PURCHASED]: 'purchased',
}

/** Mirror of CONSUMER_OFFER_STATUS for plugin UI (no backend import). */
export const CONSUMER_OFFER_STATUS = {
  DRAFT: 'draft',
  PREVIEW: 'preview',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COUNTERED: 'countered',
  DECLINED: 'declined',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  CHECKOUT_READY: 'checkout_ready',
  PURCHASED: 'purchased',
  CHECKOUT_FAILED: 'checkout_failed',
} as const

export type ConsumerOfferStatus =
  (typeof CONSUMER_OFFER_STATUS)[keyof typeof CONSUMER_OFFER_STATUS]

export type UiSurface = 'inline' | 'panel'

export type NegotiableProduct = {
  shopId: string
  productId: string
  variantId: string
  title: string
  merchantName: string
  imageUrl?: string
  listPriceCents: number
  minOfferCents?: number
  maxOfferCents?: number
  currencyCode: string
}

export type OfferQuote = {
  offerAmountCents: number
  currencyCode: string
  feesCents?: number
  expiresAt?: string
}

export type ConsumerOfferView = {
  offerId: string
  status: ConsumerOfferStatus
  offerAmountCents: number
  counterAmountCents?: number
  currencyCode: string
  product: NegotiableProduct
  merchantResponseAt?: string
}

export type CheckoutHandoff = {
  continueUrl: string
  checkoutPath: 'external_merchant'
}

export type UiActionType =
  | 'connect'
  | 'name_price'
  | 'preview'
  | 'confirm_submit'
  | 'submit'
  | 'track'
  | 'checkout'
  | 'accept_counter'
  | 'decline_counter'
  | 'reoffer'
  | 'search_again'
  | 'requote'
  | 'refresh_quote'
  | 'open_checkout'
  | 'retry_checkout'
  | 'view_order'
  | 'request_brand'

export type UiAction = {
  type: UiActionType
  payload?: Record<string, string | number | undefined>
}

export type BuyrMcpAppProps = {
  surface: UiSurface
  stateId: UiStateId
  product?: NegotiableProduct
  draftAmountCents?: number
  quote?: OfferQuote
  offer?: ConsumerOfferView
  checkout?: CheckoutHandoff
  errorMessage?: string
  isAuthenticated?: boolean
  onAction?: (action: UiAction) => void
}
