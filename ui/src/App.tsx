import './app.css'
import { NegotiationPanel } from './NegotiationPanel'
import { OfferCard } from './OfferCard'
import type { BuyrMcpAppProps } from './types'

export type AppProps = BuyrMcpAppProps

export const App = (props: AppProps) => {
  const { surface } = props

  if (surface === 'panel') {
    return <NegotiationPanel {...props} />
  }

  return <OfferCard {...props} />
}
