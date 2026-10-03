import type { BuyrMcpAppProps, UiAction } from './types'
import {
  getStateAccessibleLabel,
  getStateStatusClass,
  UiStateContent,
} from './states/UiStateContent'

export type OfferCardProps = BuyrMcpAppProps

export const OfferCard = (props: OfferCardProps) => {
  const { stateId, onAction } = props

  const handleAction = (action: UiAction) => {
    onAction?.(action)
  }

  const statusClass = getStateStatusClass(stateId)

  return (
    <article
      className="buyr-mcp buyr-mcp__card"
      aria-labelledby="buyr-card-heading"
    >
      <p
        id="buyr-card-heading"
        className={`buyr-mcp__status ${statusClass}`.trim()}
      >
        {getStateAccessibleLabel(stateId)}
      </p>
      <UiStateContent {...props} onAction={handleAction} />
    </article>
  )
}
