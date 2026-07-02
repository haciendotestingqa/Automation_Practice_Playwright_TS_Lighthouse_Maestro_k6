# PrestaShop E2E — Playwright (JavaScript)

[English](README.en.md)

Flujo e-commerce en [demo.prestashop.com](https://demo.prestashop.com/) con Page Object Model y helpers compartidos.

## Flujo cubierto

1. Esperar provisioning de la tienda (`waitForShopReady`)
2. Navegar a categoría **Clothes**
3. Abrir **Hummingbird printed t-shirt**
4. Añadir al carrito (con reintentos)
5. Verificar carrito e iniciar checkout como invitado

## Estructura

```text
fixtures/shop-ready.js    → fixture shopReadyPage
pages/HomePage.js
pages/ProductPage.js
pages/CartPage.js
tests/e2e/shopping-cart.spec.js
../shared/shop-ready.js   → iframe + boot demo
../shared/add-to-cart.js  → add to cart anti-flaky
```

## Comandos

```bash
npm install
npx playwright install chromium
npm test
npm run test:headed   # navegador visible
```

## Notas de selectores

- La tienda corre dentro de un **iframe** → todos los locators usan `getShopFrame(page)`.
- En detalle de producto, el botón Add to cart está en `main`, no en `article` (evita productos relacionados).
- Tras add to cart, navegar al carrito vía el modal **Proceed to checkout** (el header queda bloqueado).
