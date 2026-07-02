# Web — Automatización PrestaShop

[English](README.en.md)

Prácticas web sobre el demo público de [PrestaShop](https://demo.prestashop.com/): E2E con Playwright (JavaScript y TypeScript), auditorías Lighthouse y pruebas de carga con K6.

## Estructura

```text
web/
├── playwright-js/   → E2E JavaScript
├── playwright-ts/   → E2E TypeScript + Lighthouse
├── shared/          → Constantes y helpers compartidos (JS + TS)
└── k6/              → Scripts de carga HTTP
```

## Módulos

| Módulo | Descripción | README |
|--------|-------------|--------|
| `playwright-js/` | Mismo flujo E2E en JavaScript | [README.md](playwright-js/README.md) |
| `playwright-ts/` | E2E en TypeScript + audits Lighthouse | [README.md](playwright-ts/README.md) |
| `shared/` | `shop-ready`, `add-to-cart`, `constants` | — |
| `k6/` | Smoke y browse con carga conservadora | [README.md](k6/README.md) |

## Flujo E2E cubierto

1. Esperar aprovisionamiento de la tienda demo (`waitForShopReady`)
2. Navegar a categoría **Clothes**
3. Abrir **Hummingbird printed t-shirt**
4. Añadir al carrito (con reintentos anti-flaky)
5. Verificar carrito e iniciar checkout como invitado

La suite JS y TS comparten la misma lógica; los helpers viven en `shared/`.

## Comandos rápidos

```bash
# E2E JavaScript
cd web/playwright-js && npm install && npx playwright install chromium && npm test

# E2E TypeScript
cd web/playwright-ts && npm install && npx playwright install chromium && npm test

# Solo Lighthouse (workers=1)
cd web/playwright-ts && npm run test:lighthouse

# K6 (desde la raíz del repo)
k6 run web/k6/prestashop-smoke.js
k6 run web/k6/prestashop-browse.js
```

## Documentación relacionada

| Español | English |
|---------|---------|
| [Casos E2E PrestaShop](../docs/prestashop-e2e-test-cases.es.md) | [PrestaShop E2E test cases](../docs/prestashop-e2e-test-cases.en.md) |
| [Análisis Lighthouse](../docs/lighthouse-analisis.es.md) | [Lighthouse analysis](../docs/lighthouse-analisis.en.md) |
| [Análisis K6](../docs/k6-analisis.es.md) | [K6 analysis](../docs/k6-analisis.en.md) |

## Notas

- La tienda demo corre dentro de un **iframe**; los locators usan `getShopFrame(page)`.
- Los reportes Lighthouse se guardan en `playwright-ts/lighthouse-reports/` (no versionados).
- K6 golpea la URL raíz por HTTP; no sustituye los tests E2E de UI.
