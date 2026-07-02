# K6 — Pruebas de carga PrestaShop

[English](README.en.md)

Scripts de carga HTTP contra [demo.prestashop.com](https://demo.prestashop.com/). Complementan Playwright (UI) y Lighthouse (calidad de página); no abren navegador.

## Scripts

### `prestashop-smoke.js` — smoke conservador

| Parámetro | Valor |
|-----------|-------|
| VUs | 5 |
| Duración | 1 minuto |
| Acción | `GET` a la home + pausa 2 s |

**Umbrales:** p(95) &lt; 5000 ms · errores &lt; 10%

```bash
k6 run web/k6/prestashop-smoke.js
```

### `prestashop-browse.js` — browse opcional

Rampa 5 → 10 VUs (~4 min), visita home y `/#/en/`. Umbrales más estrictos: p(95) &lt; 3000 ms · errores &lt; 5%.

```bash
k6 run web/k6/prestashop-browse.js
```

## URL configurable

```bash
BASE_URL=https://tu-staging.com k6 run web/k6/prestashop-smoke.js
```

## Notas

- Perfil conservador: el demo público es compartido.
- K6 solo pide la URL raíz; no entra al iframe ni simula add-to-cart.
- Resultados detallados en [docs/k6-analisis.es.md](../../docs/k6-analisis.es.md).
