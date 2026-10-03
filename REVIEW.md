# Buyr ChatGPT plugin — OpenAI review notes

**Launch geography:** US only (`CONSUMER_PLUGIN_COUNTRIES`).

**MCP surface:** `POST /mcp/consumer` (`buyr-consumer-mcp`). Merchant agent commerce remains on `POST /mcp/shopping` and is not exposed to this plugin.

## Positive reviewer scenarios (5)

1. **Anonymous discovery** — Reviewer searches “negotiable wireless earbuds” without OAuth; `search_negotiable_products` returns read-only hits with merchant names and price hints; no PII returned.
2. **Quote then connect** — Reviewer requests a quote anonymously via `get_offer_quote`, then links Shop Pay when submitting; OAuth scopes match `openid`, `shopper:profile`, `shopper:offers.read`, `shopper:offers.write` only.
3. **Happy-path negotiation** — Reviewer submits an offer with `idempotencyKey`, sees `pending`, then `accepted` via `get_offer_status`; `prepare_checkout` returns external merchant URL; user completes purchase on merchant site (public `external_merchant` path).
4. **Counter offer** — Merchant counters; UI shows counter amount with accept / decline / re-offer; no silent price changes without shopper confirmation.
5. **Offer history** — After linking account, `list_my_offers` shows active and terminal offers with clear statuses aligned to shopper vocabulary (`pending`, `accepted`, `declined`, `expired`, etc.).

## Negative / edge reviewer scenarios (3)

1. **Declined offer** — Submit valid offer; merchant declines; shopper sees decline copy and can search again without orphaned checkout links.
2. **Stale quote** — Inventory or anchor price changes between quote and submit; UI surfaces `stale_inventory` or `stale_price` and requires refresh before submit.
3. **Checkout handoff failure** — `prepare_checkout` or merchant redirect fails; UI shows `checkout_failed` with retry and documented `continueUrl` fallback.

## Demo account (MFA-free)

For OpenAI review, use the **Buyr QA shopper** provisioned for directory review:

- Identity: secondary `buyr_email` provider (Shop Pay primary in production).
- Token: a signed `consumer_shopper` JWT from the consumer OAuth issuer. `/mcp/consumer` rejects any other bearer with 401; there is no opaque QA token.
- MFA: disabled on the review tenant for the test shopper only.
- Pre-seeded negotiable catalog SKUs on the review merchant shop (US, opted-in enrollment).
- Do not use production merchant admin credentials in ChatGPT.

Contact [buyr.com/pages/contact](https://www.buyr.com/pages/contact) for refreshed review credentials if expired.

## Policy URLs

- Privacy: https://www.buyr.com/policies/privacy-policy
- Terms: https://www.buyr.com/policies/terms-of-service
- Support: https://www.buyr.com/pages/contact
