# Lighthouse analysis — PrestaShop

Guide to what Lighthouse measures, what the scores mean, and how to interpret the results of the latest run in this lab.

**Last run:** Playwright TS — E2E 1/1 PASS + Lighthouse 3/3 PASS (`--workers=1`)

**HTML/JSON reports:** `web/playwright-ts/lighthouse-reports/`

---

## What is Lighthouse?

Lighthouse is a Google tool that **visits a page like a user would** and assigns **scores from 0 to 100** in four areas:

| Area | Question it answers |
|------|---------------------|
| **Performance** | Is the page fast or slow? |
| **Accessibility** | Can most people use it well (screen readers, contrast, etc.)? |
| **Best Practices** | Is it built correctly (security, technical errors, good practices)? |
| **SEO** | Can search engines understand and index it? |

This project audits **three steps in the purchase journey**:

1. **Home** — store landing page
2. **Product** — product detail (clothing)
3. **Cart** — cart with one item added

Tests not only measure: they also **assert scores meet minimum thresholds** defined in `web/playwright-ts/tests/lighthouse/prestashop.spec.ts`. If a score drops below, the test fails.

---

## Latest run results

### Score summary

| Page | Performance | Accessibility | Best Practices | SEO | Passed? |
|------|-------------|---------------|----------------|-----|---------|
| Home | **75** | 91 | 75 | 91 | Yes |
| Product | **69** | 91 | 75 | 91 | Yes |
| Cart | **66** | 91 | 75 | 91 | Yes |

### Minimum test thresholds

| Area | Minimum required |
|------|------------------|
| Performance | 40 |
| Accessibility | 80 |
| Best Practices | 70 |
| SEO | 70 |

**Quick conclusion:** all green. Scores are above thresholds. Performance varies most across pages; the rest stays stable.

---

## The four scores explained

### 1. Performance (66–75)

- **75 on home** → fairly good
- **69 on product** → slightly worse
- **66 on cart** → slowest of the three

The further you progress in the purchase flow, the more the page loads (images, scripts, cart logic) and the slower it gets.

### 2. Accessibility (91)

**91 is very good.** Only `html-has-lang` failed — missing `lang` on the `<html>` tag. Contrast, structure, and buttons are fine for a demo site.

### 3. Best Practices (75)

**75 = acceptable with room to improve.** Lighthouse flagged issues in the **PrestaShop demo** (not in test code):

| Issue | Meaning |
|-------|---------|
| Console errors | Page JavaScript throws warnings or errors |
| Deprecated APIs | Functions Google no longer recommends |
| Low-resolution images | Pixelated for their display size |

On **cart**, third-party scripts block the browser a bit more than on home or product.

### 4. SEO (91)

**91 = very good.** Titles, structure, and search-engine basics are in order.

---

## Speed metrics

| Acronym | In plain terms | Approx. values |
|---------|----------------|----------------|
| **FCP** | When you see **something** on screen | ~2.2 s |
| **LCP** | When the **main content** appears | 3.0–3.7 s |
| **Speed Index** | How fast the screen **fills in** | 3.6–4.3 s |
| **TBT** | Time without responding well to clicks | ~620 ms home/product; **~1.1 s cart** |
| **TTI** | When it is **truly ready** | 5.6 s home/product; **7.7 s cart** |
| **CLS** | Whether elements **jump** while loading | **0.04** — excellent |

---

## Improvement opportunities (site, not tests)

1. **Reduce unused JavaScript** (~510–550 ms recoverable)
2. **Remove render-blocking resources** (~364 ms)

---

## What this means for the lab

| Question | Answer |
|----------|--------|
| Did tests fail? | **No.** E2E and Lighthouse passed. |
| Is the site a disaster? | **No.** Decent scores for a public demo. |
| Why is cart slower? | More UI, logic, and scripts. |
| Are Playwright tests wrong? | **No.** Lighthouse measures **the website**, not automation. |

---

## PrestaShop iframe note

The demo store lives inside an **iframe** on `demo.prestashop.com`. JSON reports sometimes show `finalUrl` as the demo root URL. Scores are still useful as a **quality smoke**, but auditing iframe sites may require navigating to the correct frame.

---

## How to re-run

```bash
cd web/playwright-ts
npm run test:lighthouse   # Lighthouse only
npm test                  # E2E + Lighthouse
```

Reports in `web/playwright-ts/lighthouse-reports/` (`.html` and `.json`).

---

## Quick glossary

| Term | Meaning |
|------|---------|
| **Lighthouse** | Google tool that audits web quality (0–100) |
| **Performance** | Load speed and responsiveness |
| **Accessibility (a11y)** | Usability for people with different abilities |
| **Best Practices** | Technical quality of the site |
| **SEO** | Search engine readiness |
| **Threshold** | Minimum score for the test to pass |
| **Third-party** | External code (analytics, widgets) |
| **Smoke test** | Quick check of limits or basic behavior |
