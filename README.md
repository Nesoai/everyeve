# EveryEve

A holiday store for Halloween through New Year's Eve, built for Cloudflare Pages. 43 printed products are made to order by **Printful**. Ready-made decor can be added from **CJdropshipping's US warehouses**. Customers pay through Stripe Checkout, and each paid order goes to the right supplier automatically.

## What's in the folder

| Path | What it is |
|---|---|
| `index.html` | The storefront. Static, no build step. |
| `catalog.js` | Every printed product, price, color, design and shipping rate. Read by the page and by the server. **Edit prices here.** |
| `cj-products.js` | CJdropshipping products. Written by `scripts/cj-import.mjs`; don't edit by hand. Empty until you import. |
| `images/` | Real product photos. Created by the two scripts below. Until they exist, the site shows drawn previews. |
| `mockups.js` | The drawn previews used when a product has no photo yet. |
| `functions/api/checkout.js` | Creates the Stripe Checkout session. Prices come from the catalog, never from the browser. |
| `functions/api/stripe-webhook.js` | On a paid order, sends printed lines to Printful and ready-made lines to CJ. |
| `lib/cj.js` | CJ sign-in, shipping choice and order creation. |
| `print-files/` | 75 print-ready PNGs, one per design and product shape (garment, mug wrap, pillow, poster, card, blanket, puzzle, sticker sheet). |
| `scripts/printful-map.json` | Which Printful catalog item makes each product type, with catalog and variant IDs. Already filled in. |
| `scripts/printful-sync.mjs` | Creates all printed products in Printful and downloads their product photos. |
| `scripts/cj-picks.json`, `scripts/cj-import.mjs` | The CJ products you choose, and the script that imports them. |

## Decisions for a principal before taking money

1. **A new rail.** The Finance Book makes Gumroad the only rail with a checkout. Physical goods need a shipping address and a hand-off to suppliers, which Gumroad can't do here; this store uses Stripe Checkout. That is a Finance Book change.
2. **Sales tax.** `STRIPE_TAX` is off. Turning it on needs Stripe Tax registrations, which depend on where the company has nexus. Take it to counsel with the open TN / CT qualification question. Kentucky is the state of organization; don't assume it is the only registration.
3. **Margins.** Retail prices in `catalog.js` are proposed. Compare each against Printful's base cost plus shipping before going live. The CJ import prints cost, shipping and margin for every item.
4. **Returns wording.** The page promises a replacement or refund for damaged or misprinted items reported with a photo within 30 days, and no returns for size or change of mind. Printful reprints its own errors at no cost when reported with proof. Check CJ's dispute terms match before listing CJ items.
5. **Paying suppliers.** Printful charges the card on file when an order is confirmed. CJ orders are paid from a CJ balance you top up. Both start in "a principal approves each order" mode; see step 7.

## Where the money lands

Relay can't be the checkout: its card acceptance is invoices and payment requests sent to one customer at a time. Customers pay through Stripe Checkout, and Stripe pays out to the Relay operating account (Stripe → Settings → Bank accounts and scheduling).

## Go live

### 1. Put the site online (about 15 minutes)
Create a GitHub repo, upload this folder's contents, and connect it to Cloudflare Pages following the *Connecting a repo to Cloudflare Pages* guide (framework None, no build command, output blank). Pages picks up `functions/` automatically. The free `*.pages.dev` address works for everything below; attach the real domain whenever it's chosen, then add `<link rel="canonical" href="https://HOST/">` where `index.html` marks it.

### 2. Stripe (about 10 minutes)
Copy the **test** secret key. Add it in Pages → Settings → Variables and secrets as `STRIPE_SECRET_KEY`.

### 3. Printful (about 30 minutes, mostly waiting)
1. Create the account in the company name. **Stores → Connect via API** creates the store. **Settings → API** → create a private token with product, order and file access.
2. On a computer with Node 18 or later, in this folder:
   ```
   npm i @resvg/resvg-js            (only needed to re-render print files)
   PRINTFUL_TOKEN=... SITE_URL=https://everyeve.pages.dev node scripts/printful-sync.mjs --dry-run
   PRINTFUL_TOKEN=... SITE_URL=https://everyeve.pages.dev node scripts/printful-sync.mjs --only merry-crew
   ```
   The dry run checks that every color and size exists in Printful's catalog. `--only` makes one product: open it in Printful and check where the print sits. If it looks right, run the same command without `--only`. It creates all 43 products (50 in Printful, because white and black mugs are separate Printful items) and downloads real product photos into `images/`. Printful limits its photo generator to a few requests a minute, so the full run takes 20 to 40 minutes.
3. Upload the new `images/` folder to the repo. The site shows the photos as soon as Pages redeploys.
4. Add `PRINTFUL_TOKEN` to Pages variables (and `PRINTFUL_STORE_ID` if the token covers more than one store).

### 4. CJdropshipping (optional, about 1 hour)
1. Create the account and add funds to the CJ balance. Generate an API key in CJ's API settings.
2. Find US-stock products: `CJ_API_KEY=... node scripts/cj-import.mjs --search "led menorah"`. It lists only items in stock in a US warehouse, so they arrive in days rather than weeks.
3. Add your picks to `scripts/cj-picks.json` (the file shows the format), then run `CJ_API_KEY=... node scripts/cj-import.mjs`. Check the cost, shipping and margin it prints. Upload `cj-products.js` and `images/cj/`.
4. Add `CJ_API_KEY` to Pages variables.

What to pick: holiday decor and gifts that aren't printable, such as LED menorahs, dreidel sets, kinara candle sets, Diwali diya sets, ornament sets, battery candles and party kits. Avoid anything with a brand name, licensed character or logo you don't own; CJ lists many look-alikes. Be careful with children's toys and plug-in electrical items, which need safety certification (CPSIA for kids' products, UL listing for plug-in electrics). Battery-powered decor avoids most of that.

### 5. Webhook (5 minutes)
Stripe → Developers → Webhooks → add endpoint `https://HOST/api/stripe-webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Put its signing secret in Pages as `STRIPE_WEBHOOK_SECRET`.

### 6. Test purchase (10 minutes)
In test mode, buy a printed item and (if listed) a CJ item, one order with express and a gift message, using card 4242 4242 4242 4242. Check that:
- a **draft** order appears in Printful with the right items, address and shipping method (then delete it);
- an **unpaid** order appears in CJ's order list (then cancel it).
Nothing has run against live Stripe, Printful or CJ yet, so this step is the proof.

### 7. Switch to live
Replace the test key and webhook secret with live ones. Then choose how hands-off to be:
- `PRINTFUL_AUTO_CONFIRM=true` sends Printful orders straight to production. Without it, confirm each draft in Printful (one click).
- `CJ_AUTO_PAY=true` pays CJ orders from the CJ balance. Without it, pay each order in CJ's order list.

## Things the test purchase must confirm

- `STANDARD` and `EXPRESS` are the right Printful shipping method names for your store. Change `PRINTFUL_EXPRESS_METHOD` if not.
- The print position on the `--only` product matches the photo. The sync asks Printful to center the art and align it to the top on apparel. If Printful rejects that instruction, the script retries without it and Printful uses its default placement.
- CJ accepts the full state name in the address (the webhook sends "Tennessee", not "TN").

## Running it day to day

- **Orders:** unless auto modes are on, confirm Printful drafts and pay CJ orders daily. Failed hand-offs show in Stripe → Webhooks and retry for three days; each supplier ignores an order it already has.
- **Damage claims:** Printful reprint request, or CJ dispute; refund in Stripe if the customer prefers.
- **Arrival dates:** the page counts 2–5 production days for printed items (3–6 for blankets, puzzles, beanies) and 1–3 handling days for CJ items, plus 3–7 transit days standard or 1–3 express, in business days. When Printful publishes its 2026 holiday cutoffs, compare them with the "order by" dates the page shows and adjust `transit` in `catalog.js` if they differ.
- **Adding a printed product:** add a line to `catalog.js`, run `node scripts/render-print-files.mjs`, push, then run the sync with `--only <id>` and push `images/`.
- **Re-taking photos:** `--photos-only` downloads fresh photos without touching the Printful products. `--replace` rebuilds a product that already exists.
