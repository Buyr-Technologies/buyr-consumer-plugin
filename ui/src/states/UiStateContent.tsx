import type { ReactNode } from 'react'
import { formatMoney } from '../format'
import {
  UI_STATE_ID,
  type BuyrMcpAppProps,
  type UiAction,
  type UiStateId,
} from '../types'

type StateContentProps = BuyrMcpAppProps & {
  onAction: (action: UiAction) => void
}

const stateLabel: Record<UiStateId, string> = {
  [UI_STATE_ID.DISCONNECTED]: 'Sign in required',
  [UI_STATE_ID.LOADING]: 'Loading',
  [UI_STATE_ID.NO_MATCH]: 'No matches',
  [UI_STATE_ID.ELIGIBLE]: 'Eligible to negotiate',
  [UI_STATE_ID.DRAFT]: 'Your offer',
  [UI_STATE_ID.PREVIEW]: 'Offer preview',
  [UI_STATE_ID.CONFIRMING]: 'Confirm offer',
  [UI_STATE_ID.SUBMITTING]: 'Submitting',
  [UI_STATE_ID.PENDING]: 'Pending merchant review',
  [UI_STATE_ID.ACCEPTED]: 'Offer accepted',
  [UI_STATE_ID.COUNTERED]: 'Counter offer',
  [UI_STATE_ID.DECLINED]: 'Offer declined',
  [UI_STATE_ID.CANCELED]: 'Offer canceled',
  [UI_STATE_ID.EXPIRED]: 'Offer expired',
  [UI_STATE_ID.STALE_INVENTORY]: 'Inventory changed',
  [UI_STATE_ID.STALE_PRICE]: 'Price changed',
  [UI_STATE_ID.CHECKOUT_HANDOFF]: 'Continue to checkout',
  [UI_STATE_ID.CHECKOUT_FAILED]: 'Checkout failed',
  [UI_STATE_ID.PURCHASED]: 'Purchase complete',
}

const PrimaryButton = ({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    className="buyr-mcp__btn buyr-mcp__btn--primary"
    onClick={onClick}
  >
    {label}
  </button>
)

const SecondaryButton = ({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    className="buyr-mcp__btn buyr-mcp__btn--ghost"
    onClick={onClick}
  >
    {label}
  </button>
)

const ProductHeader = ({
  product,
}: {
  product: StateContentProps['product']
}) => {
  if (!product) {
    return null
  }

  return (
    <header className="buyr-mcp__header">
      {product.imageUrl ? (
        <img
          className="buyr-mcp__thumb"
          src={product.imageUrl}
          alt=""
          width={56}
          height={56}
        />
      ) : (
        <div className="buyr-mcp__thumb" aria-hidden="true" />
      )}
      <div>
        <h2 className="buyr-mcp__title">{product.title}</h2>
        <p className="buyr-mcp__merchant">{product.merchantName}</p>
      </div>
    </header>
  )
}

const statusTone = (stateId: UiStateId): string => {
  if (stateId === UI_STATE_ID.ACCEPTED || stateId === UI_STATE_ID.PURCHASED) {
    return 'buyr-mcp__status--success'
  }
  if (
    stateId === UI_STATE_ID.STALE_INVENTORY ||
    stateId === UI_STATE_ID.STALE_PRICE ||
    stateId === UI_STATE_ID.COUNTERED ||
    stateId === UI_STATE_ID.PENDING
  ) {
    return 'buyr-mcp__status--warning'
  }
  if (
    stateId === UI_STATE_ID.DECLINED ||
    stateId === UI_STATE_ID.CHECKOUT_FAILED ||
    stateId === UI_STATE_ID.EXPIRED
  ) {
    return 'buyr-mcp__status--danger'
  }
  return ''
}

export const UiStateContent = (props: StateContentProps): ReactNode => {
  const { stateId, product, quote, offer, checkout, errorMessage, onAction } =
    props

  const rangeHint =
    product?.minOfferCents != null && product?.maxOfferCents != null
      ? `${formatMoney({
          amountCents: product.minOfferCents,
          currencyCode: product.currencyCode,
        })} – ${formatMoney({
          amountCents: product.maxOfferCents,
          currencyCode: product.currencyCode,
        })}`
      : null

  switch (stateId) {
    case UI_STATE_ID.DISCONNECTED:
      return (
        <>
          <p className="buyr-mcp__body" id="buyr-state-desc">
            Link Shop Pay or your Buyr account to submit offers and track
            negotiations.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Connect"
              onClick={() => onAction({ type: 'connect' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.LOADING:
      return (
        <>
          <p className="buyr-mcp__sr-only" aria-live="polite">
            Loading Buyr offer data
          </p>
          <div className="buyr-mcp__skeleton" aria-hidden="true" />
        </>
      )

    case UI_STATE_ID.NO_MATCH:
      return (
        <>
          <p className="buyr-mcp__body" id="buyr-state-desc">
            No negotiable products matched your search. Try another brand or ask
            us to add a merchant.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Request brand"
              onClick={() => onAction({ type: 'request_brand' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.ELIGIBLE:
      return (
        <>
          <ProductHeader product={product} />
          {rangeHint ? (
            <p className="buyr-mcp__hint" id="buyr-state-desc">
              Typical offer range: {rangeHint}
            </p>
          ) : (
            <p className="buyr-mcp__hint" id="buyr-state-desc">
              List price{' '}
              {product
                ? formatMoney({
                    amountCents: product.listPriceCents,
                    currencyCode: product.currencyCode,
                  })
                : '—'}
            </p>
          )}
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Name your price"
              onClick={() => onAction({ type: 'name_price' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.DRAFT:
      return (
        <>
          <ProductHeader product={product} />
          <label className="buyr-mcp__hint" htmlFor="buyr-offer-amount">
            Your offer amount
          </label>
          <input
            id="buyr-offer-amount"
            className="buyr-mcp__input"
            type="number"
            min={0}
            step={0.01}
            aria-describedby="buyr-state-desc"
            defaultValue={
              props.draftAmountCents != null
                ? (props.draftAmountCents / 100).toFixed(2)
                : undefined
            }
          />
          <p className="buyr-mcp__hint" id="buyr-state-desc">
            You can change this before submitting to the merchant.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Preview"
              onClick={() => onAction({ type: 'preview' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.PREVIEW:
      return (
        <>
          <ProductHeader product={product} />
          <div className="buyr-mcp__amount-row">
            <span className="buyr-mcp__amount">
              {quote
                ? formatMoney({
                    amountCents: quote.offerAmountCents,
                    currencyCode: quote.currencyCode,
                  })
                : '—'}
            </span>
            <span className="buyr-mcp__hint">before fees</span>
          </div>
          <p className="buyr-mcp__body" id="buyr-state-desc">
            This quote is not submitted until you confirm. Merchant response
            times vary.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Confirm offer"
              onClick={() => onAction({ type: 'confirm_submit' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.CONFIRMING:
      return (
        <>
          <ProductHeader product={product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            Submit this offer to the merchant? You can track status after
            submission.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Submit"
              onClick={() => onAction({ type: 'submit' })}
            />
            <SecondaryButton
              label="Back"
              onClick={() => onAction({ type: 'preview' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.SUBMITTING:
      return (
        <>
          <p className="buyr-mcp__sr-only" aria-live="polite">
            Submitting your offer
          </p>
          <div className="buyr-mcp__skeleton" aria-hidden="true" />
        </>
      )

    case UI_STATE_ID.PENDING:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            The merchant is reviewing your offer of{' '}
            {offer
              ? formatMoney({
                  amountCents: offer.offerAmountCents,
                  currencyCode: offer.currencyCode,
                })
              : '—'}
            . We will update this card when they respond.
          </p>
          <div className="buyr-mcp__actions">
            <SecondaryButton
              label="Track"
              onClick={() => onAction({ type: 'track' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.ACCEPTED:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            Your offer was accepted at{' '}
            {offer
              ? formatMoney({
                  amountCents: offer.offerAmountCents,
                  currencyCode: offer.currencyCode,
                })
              : '—'}
            . Complete purchase on the merchant store.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Checkout"
              onClick={() => onAction({ type: 'checkout' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.COUNTERED:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            The merchant countered at{' '}
            {offer?.counterAmountCents != null
              ? formatMoney({
                  amountCents: offer.counterAmountCents,
                  currencyCode: offer.currencyCode,
                })
              : '—'}
            .
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Accept counter"
              onClick={() => onAction({ type: 'accept_counter' })}
            />
            <SecondaryButton
              label="Decline"
              onClick={() => onAction({ type: 'decline_counter' })}
            />
            <SecondaryButton
              label="Re-offer"
              onClick={() => onAction({ type: 'reoffer' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.DECLINED:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            The merchant declined this offer. Search for another product or try
            a different amount.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Search again"
              onClick={() => onAction({ type: 'search_again' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.CANCELED:
      return (
        <>
          <p className="buyr-mcp__body" id="buyr-state-desc">
            You canceled this offer.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Search again"
              onClick={() => onAction({ type: 'search_again' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.EXPIRED:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            This quote or offer expired. Request a new quote before submitting
            again.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Re-quote"
              onClick={() => onAction({ type: 'requote' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.STALE_INVENTORY:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            Inventory changed since your last quote. Refresh before you submit.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Refresh quote"
              onClick={() => onAction({ type: 'refresh_quote' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.STALE_PRICE:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            The merchant list price changed. Refresh your quote to continue.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Refresh quote"
              onClick={() => onAction({ type: 'refresh_quote' })}
            />
          </div>
        </>
      )

    case UI_STATE_ID.CHECKOUT_HANDOFF:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            Continue on the merchant site to pay securely. Buyr does not store
            your card for this checkout.
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Open checkout"
              onClick={() =>
                onAction({
                  type: 'open_checkout',
                  payload: { continueUrl: checkout?.continueUrl },
                })
              }
            />
          </div>
        </>
      )

    case UI_STATE_ID.CHECKOUT_FAILED:
      return (
        <>
          <p className="buyr-mcp__body" id="buyr-state-desc">
            {errorMessage ??
              'We could not start checkout. Retry or use the merchant link.'}
          </p>
          <div className="buyr-mcp__actions">
            <PrimaryButton
              label="Retry"
              onClick={() => onAction({ type: 'retry_checkout' })}
            />
            {checkout?.continueUrl ? (
              <SecondaryButton
                label="Open fallback URL"
                onClick={() =>
                  onAction({
                    type: 'open_checkout',
                    payload: { continueUrl: checkout.continueUrl },
                  })
                }
              />
            ) : null}
          </div>
        </>
      )

    case UI_STATE_ID.PURCHASED:
      return (
        <>
          <ProductHeader product={product ?? offer?.product} />
          <p className="buyr-mcp__body" id="buyr-state-desc">
            Order confirmed. Save your receipt from the merchant for returns and
            support.
          </p>
          <div className="buyr-mcp__actions">
            <SecondaryButton
              label="View order"
              onClick={() => onAction({ type: 'view_order' })}
            />
          </div>
        </>
      )

    default:
      return (
        <p className="buyr-mcp__body" id="buyr-state-desc">
          Unknown state.
        </p>
      )
  }
}

export const getStateAccessibleLabel = (stateId: UiStateId): string =>
  stateLabel[stateId]

export const getStateStatusClass = (stateId: UiStateId): string =>
  statusTone(stateId)
