import type { BuyrMcpAppProps, UiAction } from './types'
import {
  getStateAccessibleLabel,
  getStateStatusClass,
  UiStateContent,
} from './states/UiStateContent'

export type NegotiationPanelProps = BuyrMcpAppProps

export const NegotiationPanel = (props: NegotiationPanelProps) => {
  const { stateId, offer, onAction } = props

  const handleAction = (action: UiAction) => {
    onAction?.(action)
  }

  const statusClass = getStateStatusClass(stateId)
  const panelTitle =
    offer?.product?.title != null
      ? `Negotiation: ${offer.product.title}`
      : 'Negotiation'

  return (
    <section
      className="buyr-mcp buyr-mcp__card buyr-mcp__card--panel"
      aria-labelledby="buyr-panel-heading"
    >
      <h1 id="buyr-panel-heading" className="buyr-mcp__title">
        {panelTitle}
      </h1>
      <p className={`buyr-mcp__status ${statusClass}`.trim()}>
        {getStateAccessibleLabel(stateId)}
      </p>
      <UiStateContent {...props} onAction={handleAction} />
    </section>
  )
}
