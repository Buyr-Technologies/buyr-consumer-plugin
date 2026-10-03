export const formatMoney = ({
  amountCents,
  currencyCode,
}: {
  amountCents: number
  currencyCode: string
}): string => {
  const amount = amountCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}
