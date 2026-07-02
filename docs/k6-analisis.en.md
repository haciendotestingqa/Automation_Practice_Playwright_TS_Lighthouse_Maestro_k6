# K6 analysis — PrestaShop

Guide to what K6 does, what the report numbers mean, and how to interpret the scripts in this lab.

**Last run (smoke):** `k6 run web/k6/prestashop-smoke.js` — **PASS**

---

## What is K6?

K6 is a **load testing** tool. It simulates **multiple users at once** sending HTTP requests to your site.

It does not open a browser. It does not click. It does not replace Playwright.

| Tool | What it tests |
|------|---------------|
| **Playwright** | Does the purchase flow work? (UI, buttons, cart) |
| **Lighthouse** | Is the page fast, accessible, and well built? (1 user, browser) |
| **K6** | Can the server handle concurrent users? (pure HTTP) |

---

```bash
# E2E + Lighthouse
cd web/playwright-ts && npm test

# HTTP load
k6 run web/k6/prestashop-smoke.js
```

In this lab they live in different folders: `web/playwright-ts/` and `web/k6/`.

---

## Scripts in this project

### 1. `prestashop-smoke.js`

**Conservative** profile to avoid overloading the public demo:

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `vus` | 5 | 5 concurrent virtual users |
| `duration` | 1m | For 1 minute |
| Per-user action | `GET` home + 2 s wait | Hit URL and loop |

**Thresholds:**

| Threshold | Rule | In plain terms |
|-----------|------|----------------|
| `http_req_duration` | p(95) &lt; 5000 ms | 95% of requests finish under 5 seconds |
| `errors` | rate &lt; 0.1 | Less than 10% errors |

### 2. `prestashop-browse.js` — optional extra

More aggressive: ramps users (5 → 10) and visits two URLs. Stricter thresholds (p95 &lt; 3 s, errors &lt; 5%).

---

## Latest run results (smoke)

| Metric | Value | OK? |
|--------|-------|-----|
| Virtual users (VUs) | 5 | — |
| Duration | 1 minute | — |
| Total requests | 140 | — |
| Checks `home status 200` | **140/140 (100%)** | Yes |
| Failed HTTP requests | **0%** | Yes |
| Average latency | ~167 ms | Very good |
| p(95) latency | **173 ms** (limit 5000 ms) | Yes |
| Custom error rate | **0%** (limit 10%) | Yes |
| **Threshold verdict** | **All PASS** | Yes |

**Conclusion:** with 5 users for 1 minute, the demo always returned HTTP 200 with low latency.

---

## Report metrics

### THRESHOLDS

Rules defined in the script. If broken, the test **fails**.

### checks_total / checks_succeeded

Assertions inside the script (`check(...)`). In smoke: *is HTTP status 200?*

### http_req_duration

| Stat | What it is | Approx. value |
|------|------------|---------------|
| **avg** | Average | 167 ms |
| **med** | Median | 155 ms |
| **p(95)** | 95% faster than this | **173 ms** |
| **max** | Slowest | 397 ms |

**p(95)** matters in performance: it reflects **most users**, not just the average.

### http_req_failed

- **0%** = no HTTP-level failures.

### iterations

One **iteration** = one user runs `default` once (GET + 2 s sleep). **140 iterations** in 1 min with 5 VUs.

### vus

Simulated users **at once**. Max **5** in smoke.

---

## What the code does (smoke)

```javascript
const BASE_URL = __ENV.BASE_URL || 'https://demo.prestashop.com/';
export const options = { vus: 5, duration: '1m', thresholds: { ... } };
const home = http.get(BASE_URL);
check(home, { 'home status 200': (r) => r.status === 200 });
sleep(2);
```

- `BASE_URL` overridable via environment
- Each VU GETs the home page and waits 2 s (realism + avoid hammering the server)

---

## Load test vs stress test

| Type | Goal | This lab |
|------|------|----------|
| **Load test** | **Expected** or moderate load | `prestashop-smoke.js` (5 VU) |
| **Stress test** | Push until **failure** | Not on public demo |
| **Load smoke** | Does it survive light traffic? | Smoke = this |

**Ethics:** PrestaShop demo is shared. We use **5 VUs, 1 minute**.

---

## K6 vs Lighthouse

| | Lighthouse | K6 |
|---|------------|-----|
| Users | 1 browser | Many parallel virtual users |
| Measures | Page quality | Server / network under concurrency |
| Browser | Yes | No |
| PrestaShop iframe demo | Audits what the browser sees | Only hits root URL via HTTP |

K6 smoke does **not** enter the iframe or simulate add-to-cart.

---

## What this means for the lab

| Question | Answer |
|----------|--------|
| Did K6 fail? | **No** on the last smoke run. |
| Is the server unlimited? | **No.** Only **light** load tested. |
| Does it replace Playwright? | **No.** Complements: functional (E2E) + load (K6). |

---

## How to re-run

```bash
k6 run web/k6/prestashop-smoke.js
k6 run web/k6/prestashop-browse.js
BASE_URL=https://your-staging.com k6 run web/k6/prestashop-smoke.js
```

---

## Quick glossary

| Term | Meaning |
|------|---------|
| **VU** | Virtual user looping the script |
| **Iteration** | One full script run per VU |
| **Threshold** | Pass/fail rule at the end of the test |
| **p(95)** | 95% of requests were faster than this value |
| **check** | In-script assertion (e.g. status 200) |
| **Load test** | Moderate/expected load |
| **Stress test** | Push the system to its limit |
