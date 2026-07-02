# Análisis Lighthouse — PrestaShop

Guía para entender qué mide Lighthouse, qué significan las notas y cómo interpretar los resultados de la última ejecución en este lab.

**Última corrida:** Playwright TS — E2E 1/1 PASS + Lighthouse 3/3 PASS (`--workers=1`)

**Reportes HTML/JSON:** `web/playwright-ts/lighthouse-reports/`

---

## ¿Qué es Lighthouse?

Lighthouse es una herramienta de Google que **visita una página web como lo haría un usuario** y asigna **notas de 0 a 100** en cuatro áreas:

| Área | Pregunta que responde |
|------|------------------------|
| **Performance** | ¿La página va rápida o lenta? |
| **Accessibility** | ¿La puede usar bien casi todo el mundo (lectores de pantalla, contraste, etc.)? |
| **Best Practices** | ¿Está bien hecha por dentro (seguridad, errores técnicos, buenas prácticas)? |
| **SEO** | ¿Google puede entenderla e indexarla bien? |

En este proyecto auditamos **tres momentos del recorrido de compra**:

1. **Home** — página de inicio de la tienda
2. **Product** — detalle de un producto (ropa)
3. **Cart** — carrito con un artículo añadido

Los tests no solo miden: también **comprueban que las notas superen unos mínimos** definidos en `web/playwright-ts/tests/lighthouse/prestashop.spec.ts`. Si una nota cae por debajo, el test falla.

---

## Resultados de la última ejecución

### Resumen de notas

| Página | Performance | Accessibility | Best Practices | SEO | ¿Pasó? |
|--------|-------------|---------------|----------------|-----|--------|
| Home | **75** | 91 | 75 | 91 | Sí |
| Product | **69** | 91 | 75 | 91 | Sí |
| Cart | **66** | 91 | 75 | 91 | Sí |

### Umbrales mínimos del test

| Área | Mínimo exigido |
|------|----------------|
| Performance | 40 |
| Accessibility | 80 |
| Best Practices | 70 |
| SEO | 70 |

**Conclusión rápida:** todo en verde. Las notas están por encima de los mínimos. La performance es la que más varía entre páginas; el resto se mantiene estable.

---

## Las cuatro notas, explicadas

### 1. Performance (66–75)

- **75 en home** → bastante bien
- **69 en producto** → un poco peor
- **66 en carrito** → la más lenta de las tres

Cuanto más avanzas en la compra, más cosas carga la página (imágenes, scripts, lógica del carrito) y por eso va un poco más lenta.

### 2. Accessibility (91)

**91 es una nota muy buena.** Solo falló `html-has-lang` — falta `lang` en la etiqueta `<html>`. El resto (contraste, estructura, botones) está bien para un sitio demo.

### 3. Best Practices (75)

**75 = aceptable, con margen de mejora.** Lighthouse detectó en el **demo de PrestaShop** (no en el código de tests):

| Problema | Qué significa |
|----------|----------------|
| Errores en consola | JavaScript de la página lanza avisos o errores |
| APIs deprecadas | Funciones que Google ya no recomienda |
| Imágenes de baja resolución | Pixeladas para el tamaño en pantalla |

En **carrito**, scripts de terceros bloquean un poco más el navegador que en home o producto.

### 4. SEO (91)

**91 = muy bien.** Títulos, estructura y lo básico para buscadores están en orden.

---

## Métricas de velocidad

| Sigla | En palabras simples | Valores aprox. |
|-------|---------------------|----------------|
| **FCP** | Cuándo ves **algo** en pantalla | ~2.2 s |
| **LCP** | Cuándo aparece **lo principal** | 3.0–3.7 s |
| **Speed Index** | Qué tan rápido **se llena** la pantalla | 3.6–4.3 s |
| **TBT** | Tiempo sin responder bien a clics | ~620 ms home/product; **~1.1 s carrito** |
| **TTI** | Cuándo está **lista de verdad** | 5.6 s home/product; **7.7 s carrito** |
| **CLS** | Si los elementos **saltan** al cargar | **0.04** — excelente |

---

## Oportunidades de mejora (del sitio, no de los tests)

1. **Reducir JavaScript sin usar** (~510–550 ms recuperables)
2. **Eliminar recursos que bloquean la pintura** (~364 ms)

---

## ¿Qué significa para este lab?

| Pregunta | Respuesta |
|----------|-----------|
| ¿Fallaron los tests? | **No.** E2E y Lighthouse pasaron. |
| ¿La web es un desastre? | **No.** Notas decentes para un demo público. |
| ¿Por qué el carrito va peor? | Más pantalla, más lógica, más scripts. |
| ¿Los tests de Playwright están mal? | **No.** Lighthouse mide **el sitio web**, no la automatización. |

---

## Nota sobre PrestaShop y el iframe

La tienda demo vive dentro de un **iframe** en `demo.prestashop.com`. En los reportes JSON a veces `finalUrl` aparece como la URL raíz del demo. Los scores siguen siendo útiles como **smoke de calidad**, pero auditar sitios con iframes puede requerir navegar al frame correcto.

---

## Cómo volver a ejecutar

```bash
cd web/playwright-ts
npm run test:lighthouse   # solo Lighthouse
npm test                  # E2E + Lighthouse
```

Reportes en `web/playwright-ts/lighthouse-reports/` (`.html` y `.json`).

---

## Glosario rápido

| Término | Significado |
|---------|-------------|
| **Lighthouse** | Herramienta de Google que audita calidad web (0–100) |
| **Performance** | Velocidad de carga y respuesta |
| **Accessibility (a11y)** | Usabilidad para personas con distintas capacidades |
| **Best Practices** | Buenas prácticas técnicas del sitio |
| **SEO** | Preparación para buscadores |
| **Threshold / umbral** | Nota mínima para que el test pase |
| **Third-party** | Código externo (analytics, widgets) |
| **Smoke test** | Prueba rápida de límites o funcionamiento básico |
