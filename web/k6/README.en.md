# K6 — PrestaShop load tests

[Español](README.md)

HTTP load scripts against [demo.prestashop.com](https://demo.prestashop.com/). Complements Playwright (UI) and Lighthouse (page quality); no browser involved.

## Scripts

### `prestashop-smoke.js` — conservative smoke

| Parameter | Value |
|-----------|-------|
| VUs | 5 |
| Duration | 1 minute |
| Action | `GET` home + 2 s pause |

**Thresholds:** p(95) &lt; 5000 ms · errors &lt; 10%

```bash
k6 run web/k6/prestashop-smoke.js
```

### `prestashop-browse.js` — optional browse

Ramps 5 → 10 VUs (~4 min), hits home and `/#/en/`. Stricter thresholds: p(95) &lt; 3000 ms · errors &lt; 5%.

```bash
k6 run web/k6/prestashop-browse.js
```

## Configurable URL

```bash
BASE_URL=https://your-staging.com k6 run web/k6/prestashop-smoke.js
```

## Notes

- Conservative profile: the public demo is shared.
- K6 only requests the root URL; it does not enter the iframe or simulate add-to-cart.
- Detailed results in [docs/k6-analisis.en.md](../../docs/k6-analisis.en.md).
