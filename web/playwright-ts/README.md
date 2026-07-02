# PrestaShop E2E + Lighthouse — Playwright (TypeScript)

[English](README.en.md)

Misma suite E2E que `playwright-js/` en TypeScript, más auditorías Lighthouse sobre home, producto y carrito en [demo.prestashop.com](https://demo.prestashop.com/).

## Flujo E2E

1. Esperar provisioning de la tienda (`waitForShopReady`)
2. Navegar a categoría **Clothes**
3. Abrir **Hummingbird printed t-shirt**
4. Añadir al carrito (con reintentos)
5. Verificar carrito e iniciar checkout como invitado

Spec: `tests/e2e/shopping-cart.spec.ts`

## Lighthouse

Auditorías en `tests/lighthouse/prestashop.spec.ts`:

| Página | Reporte |
|--------|---------|
| Home | `home-*.html` / `.json` |
| Producto | `product-*.html` / `.json` |
| Carrito | `cart-*.html` / `.json` |

Umbrales mínimos (`LIGHTHOUSE_THRESHOLDS`):

| Área | Mínimo |
|------|--------|
| Performance | 40 |
| Accessibility | 80 |
| Best Practices | 70 |
| SEO | 70 |

Reportes en `lighthouse-reports/` (no versionados). Ejecutar con `--workers=1`.

## Estructura

```text
fixtures/shop-ready.ts
pages/HomePage.ts
pages/ProductPage.ts
pages/CartPage.ts
tests/e2e/shopping-cart.spec.ts
tests/lighthouse/prestashop.spec.ts
../shared/            → helpers compartidos
```

## Comandos

```bash
npm install
npx playwright install chromium
npm test                              # E2E + Lighthouse
npm run test:lighthouse               # solo Lighthouse
npx playwright test tests/e2e         # solo E2E
npm run report                        # abrir reporte HTML
```

## Notas

- Lighthouse usa Chromium con `--remote-debugging-port=9222` vía `playwright-lighthouse`.
- La tienda corre en **iframe** → locators con `getShopFrame(page)`.
