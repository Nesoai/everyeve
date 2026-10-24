# EveryEve

A made-to-order holiday store: 43 products across Halloween, Diwali, Thanksgiving, Hanukkah, Winter, Christmas, Kwanzaa and New Year's Eve, built for Cloudflare Pages. Customers pay through Stripe Checkout; paid orders go to Printful automatically, which prints and ships them.

## What's in the folder

| Path | What it is |
|---|---|
| `index.html` | The storefront. Static, no build step. |
| `mascot.js` | The shop pup illustration (banner, about section, logo mark, empty cart). |
| `mockups.js` | Draws each product type with its design for the product images. |
| `catalog.js` | Every product, price, color, design and shipping rate. Read by the page and by the server. **Edit prices here.** |
| `functions/api/checkout.js` | Creates the Stripe Checkout session. Prices are taken from `catalog.js`, never from the browser. |
| `functions/api/stripe-webhook.js` | On a paid order, creates the Printful order (draft by default). |
| `print-files/` | 58 print-ready PNGs. `*-for-light.png` / `*-for-dark.png` are transparent, 4500 px, for garments, mugs, totes, aprons. `*-on-<color>.png` have the background filled, for the items set up by hand. |
| `scripts/printful-sync.mjs` | Creates the products in Printful with SKUs that match the store. |
| `scripts/printful-map.json` | Which Printful catalog product backs each product type. Fill this in. |

## Decisions for a principal before taking money

1. **A new rail.** The Finance Book makes Gumroad the only rail with a checkout. Physical goods need a shipping address and a hand-off to the print partner, which Gumroad can't do here; this store uses Stripe Checkout. That is a Finance Book change.
2. **Sales tax.** `STRIPE_TAX` is off. Turning it on needs Stripe Tax registrations, which depend on where the company has nexus. Take it to counsel with the open TN / CT qualification question. Kentucky is the state of organization; don't assume it is the only registration.
3. **Margins.** Retail prices in `catalog.js` are proposed. Compare each against Printful's base cost plus shipping before going live; Printful shows both on each product page.
4. **Returns wording.** The page promises a replacement or refund for damaged or misprinted items reported with a photo within 30 days, and no returns for size or change of mind. Printful reprints at no cost for its own errors when reported with proof, so this matches; confirm it is the policy you want.
5. **Hostname.** Choose it before step 5 below. The store name is set in `CONFIG.storeName` and the `<title>`.
6. **The shop pup.** The mascot is an original illustration. To use a real photo instead, add `mascot.jpg` (square, at least 1200 px, a photo you own) and set `CONFIG.mascotPhoto` to `"/mascot.jpg"`; set `CONFIG.mascotName` to give the pup a name in the copy.

## Where the money lands

Relay can't be the checkout: its card acceptance is invoices and payment requests sent to one customer at a time. Customers pay through Stripe Checkout, and Stripe pays out to the Relay operating account. Set that in Stripe → Settings → Bank accounts and scheduling. Card fees are the same either way (2.9% + 30¢ on Relay's invoices; check the current Stripe rate on your account).

## Go live (about 3 to 4 hours, most of it Printful setup)

1. **Printful.** Create the account in the company name. Add a store of type *Manual order platform / API*. Settings → API → create a private token with order and product access.
2. **Stripe.** Use the existing account. Copy the **test** secret key first.
3. **Repo and Pages.** Push this folder to a new GitHub repo. Connect it to Cloudflare Pages following the *Connecting a repo to Cloudflare Pages* guide (framework None, no build command, output blank). Pages picks up `functions/` automatically.
4. **Variables** (Pages → Settings → Variables and secrets, as secrets): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PRINTFUL_TOKEN`, optional `PRINTFUL_STORE_ID`, optional `PRINTFUL_AUTO_CONFIRM=true`.
5. **Hostname.** Attach the custom domain, then add `<link rel="canonical" href="https://HOST/">` in `index.html` where the comment marks it, and push. Check the canonical on the preview host before cutover, as the guide requires.
6. **Products in Printful.** Fill `productId` (and the color names Printful uses) in `scripts/printful-map.json`, then:
   ```
   PRINTFUL_TOKEN=... SITE_URL=https://HOST node scripts/printful-sync.mjs --dry-run
   PRINTFUL_TOKEN=... SITE_URL=https://HOST node scripts/printful-sync.mjs --only grateful-tee
   ```
   Look at that one product's mockup in Printful. If the print sits right, run it without `--only`. The script then lists every SKU to set up by hand (pillows, blankets, posters, cards, candles, socks, puzzles, stickers, beanie): create each in Printful's designer with the listed `*-on-<color>.png` file and set the variant's **external ID to the SKU exactly**. Greeting-card packs need no variant; a pack of 10 is ordered as ten single cards. The beanie needs Printful's embroidery digitization.
7. **Webhook.** Stripe → Developers → Webhooks → add endpoint `https://HOST/api/stripe-webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
8. **Test purchase.** In test mode, buy two items (one with the express rate, one with a gift message) using card 4242 4242 4242 4242. Confirm a **draft** order appears in Printful with the right items, address and shipping method, then delete the draft. Nothing here has run against live Stripe or Printful yet, so this step is the proof.
9. **Switch to live.** Replace the test key and webhook secret with live ones. Decide on `PRINTFUL_AUTO_CONFIRM`: off means a principal confirms each draft in Printful (one click); on means orders go straight to production.

## Things the test purchase must confirm

- Printful accepts `external_variant_id` on order items and the SKUs as external IDs.
- `STANDARD` and `EXPRESS` are the right Printful shipping method names for your store. Change `PRINTFUL_EXPRESS_METHOD` if not.
- Mug files print centered on the side facing out; adjust placement in Printful if not.

## Running it day to day

- **Orders:** with auto-confirm off, confirm drafts in Printful daily. Failed hand-offs show in Stripe → Webhooks and are retried for three days.
- **Damage claims:** reorder through Printful's reprint request; refund in Stripe if the customer prefers.
- **Arrival dates:** the page counts 2–5 production days (3–6 for blankets, puzzles, beanies) plus 3–7 transit days standard, 1–3 express, in business days. When Printful publishes its 2026 holiday cutoffs, compare them with the "order by" dates the page shows and adjust `transit` in `catalog.js` if they differ.
- **Adding a product:** add a line to `PRODUCTS` in `catalog.js`, run the sync script with `--only`, push.

## Re-rendering print files

The designs are drawn in `catalog.js`. To re-render after a change, use `@resvg/resvg-js` with the Gloock, Caveat (700) and Bricolage Grotesque (800) fonts installed; run `scripts/render-print-files.mjs` (instructions at its top).
