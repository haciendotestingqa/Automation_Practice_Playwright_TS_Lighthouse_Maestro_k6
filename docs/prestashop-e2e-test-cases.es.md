# Casos de prueba — Flujo e-commerce PrestaShop Demo

10 casos de prueba del flujo Playwright (`shopping-cart.spec.ts`); priorizados los del **happy path ejecutado**.

| Campo | Valor |
|-------|-------|
| **SUT** | [PrestaShop Demo](https://demo.prestashop.com/) |
| **Usuario** | Invitado (guest) |
| **Producto** | Hummingbird printed t-shirt · categoría Clothes |
| **Spec** | `web/playwright-ts/tests/e2e/shopping-cart.spec.ts` |
| **Comando** | `cd web/playwright-ts && npx playwright test tests/e2e/shopping-cart.spec.ts` |

---

## Caso ejecutado (happy path)

| | |
|---|---|
| **ID** | **TC-PS-07** |
| **Prioridad** | P1 (Crítica) |
| **Nombre en código** | `guest can browse category, add product to cart and start checkout` |
| **Alcance** | Demo → iframe → Clothes → Hummingbird → add to cart → carrito (1 ítem) → checkout invitado |
| **Estado** | ✅ **EJECUTADO** — PASS (~20–25 s) |

El flujo **no** completa pago ni confirmación de pedido; termina en *Personal information* / *Order as a guest*.

---

## Índice (10 casos)

| # | ID | Título | Prioridad | Auto | En TC-PS-07 |
|---|-----|--------|-----------|------|-------------|
| 1 | TC-PS-01 | Provisionar tienda y cargar catálogo en iframe | P1 (Crítica) | Parcial | ✅ Setup |
| 2 | TC-PS-02 | Navegar a categoría Clothes | P1 (Crítica) | Sí | ✅ |
| 3 | TC-PS-03 | Abrir detalle Hummingbird printed t-shirt | P1 (Crítica) | Sí | ✅ |
| 4 | TC-PS-04 | Añadir producto al carrito | P1 (Crítica) | Sí | ✅ |
| 5 | TC-PS-05 | Ver carrito con 1 ítem | P1 (Crítica) | Sí | ✅ |
| 6 | TC-PS-06 | Iniciar checkout como invitado | P1 (Crítica) | Sí | ✅ (fin) |
| 7 | **TC-PS-07** | **Flujo E2E guest completo** | **P1 (Crítica)** | **Sí** | **✅ EJECUTADO** |
| 8 | TC-PS-08 | Reintento ante Add to cart intermitente | P1 (Crítica) | Sí | Helper de TC-PS-04 |
| 9 | TC-PS-09 | Modal post-add no bloquea el carrito | P1 (Crítica) | Sí | Helper de TC-PS-05 |
| 10 | TC-PS-10 | Checkout con carrito vacío | P2 (Importante) | No | Negativo |

---

## Leyenda

| **Prioridad** | P1 (Crítica) · P2 (Importante) |
| **Auto** | Sí · Parcial · No |
| **En TC-PS-07** | Incluido en el test Playwright ejecutado |

---

## TC-PS-01 — Provisionar tienda y cargar catálogo en iframe

`Parte del TC-PS-07` · P1 (Crítica) · Smoke · Auto: Parcial

**Prioridad:** P1 (Crítica)

**Precondiciones:** Acceso a internet.

**Pasos**

1. Abrir `https://demo.prestashop.com/`
2. Esperar “Shop is on its way” si aparece
3. Clic en “Explore front office” si aplica
4. Verificar tienda dentro del iframe

**Resultado esperado:** Catálogo visible; enlace **Clothes** en menú.

---

## TC-PS-02 — Navegar a categoría Clothes

`Parte del TC-PS-07` · P1 (Crítica) · Funcional · Auto: Sí

**Prioridad:** P1 (Crítica)

**Precondiciones:** TC-PS-01 cumplido.

**Pasos**

1. Clic en **Clothes** desde la home (iframe)

**Resultado esperado:** Listado Clothes; H1 contiene **Clothes**.

---

## TC-PS-03 — Abrir detalle Hummingbird printed t-shirt

`Parte del TC-PS-07` · P1 (Crítica) · Funcional · Auto: Sí

**Prioridad:** P1 (Crítica)

**Precondiciones:** TC-PS-02 cumplido.

**Pasos**

1. Clic en **Hummingbird printed t-shirt** en el listado

**Resultado esperado:** H1 con nombre del producto; botón **Add to cart** visible en `main`.

---

## TC-PS-04 — Añadir producto al carrito

`Parte del TC-PS-07` · P1 (Crítica) · Funcional · Auto: Sí

**Prioridad:** P1 (Crítica)

**Precondiciones:** TC-PS-03 cumplido.

**Pasos**

1. Clic en **Add to cart** en el detalle

**Resultado esperado:** Confirmación (modal, texto o badge); carrito con **1** artículo.

---

## TC-PS-05 — Ver carrito con 1 ítem

`Parte del TC-PS-07` · P1 (Crítica) · Funcional · Auto: Sí

**Prioridad:** P1 (Crítica)

**Precondiciones:** TC-PS-04 cumplido.

**Pasos**

1. Abrir carrito (modal → Proceed to checkout, o View cart)
2. Revisar contenido

**Resultado esperado:** **Shopping cart**; línea **Hummingbird**; resumen **1 item**.

---

## TC-PS-06 — Iniciar checkout como invitado

`Parte del TC-PS-07 (último paso automatizado)` · P1 (Crítica) · Smoke · Auto: Sí

**Prioridad:** P1 (Crítica)

**Precondiciones:** TC-PS-05 cumplido.

**Pasos**

1. Clic en **Proceed to checkout** en el carrito

**Resultado esperado:** Pantalla **Personal information** u **Order as a guest**.

---

## TC-PS-07 — Flujo E2E guest completo ✅ EJECUTADO

Encadena TC-PS-01 a TC-PS-06 · P1 (Crítica) · Smoke · E2E · Auto: Sí

**Prioridad:** P1 (Crítica)

**Precondiciones:** Acceso a internet. Usuario invitado.

**Pasos**

1. Abrir `https://demo.prestashop.com/`, esperar aprovisionamiento y verificar tienda en iframe (TC-PS-01)
2. Clic en **Clothes** desde la home (TC-PS-02)
3. Clic en **Hummingbird printed t-shirt** en el listado (TC-PS-03)
4. Clic en **Add to cart** en el detalle (TC-PS-04)
5. Abrir carrito y verificar línea **Hummingbird** con resumen **1 item** (TC-PS-05)
6. Clic en **Proceed to checkout** en el carrito (TC-PS-06)

**Resultado esperado:** Pantalla **Personal information** u **Order as a guest**; carrito con **1** artículo. El flujo **no** completa pago ni confirmación de pedido.

**Resultado obtenido**

Único test del spec `shopping-cart.spec.ts`. Encadena TC-PS-01 a TC-PS-06 en una sola ejecución.

| Campo | Valor |
|-------|-------|
| **Prioridad** | P1 (Crítica) |
| **Tipo** | Smoke · E2E |
| **Código** | `guest can browse category, add product to cart and start checkout` |
| **Estado** | ✅ Ejecutado — PASS (~20–25 s) |

| Paso | Acción | Assert |
|------|--------|--------|
| 1 | `shopReadyPage` — tienda en iframe | Clothes visible |
| 2 | Abrir **Clothes** | H1 = Clothes |
| 3 | Abrir **Hummingbird** | H1 = producto |
| 4 | **Add to cart** | Éxito (helper con reintentos) |
| 5 | Abrir carrito | Producto + **1 item** |
| 6 | **Proceed to checkout** | Pantalla guest |

```bash
cd web/playwright-ts && npx playwright test tests/e2e/shopping-cart.spec.ts
```

---

## TC-PS-08 — Reintento ante Add to cart intermitente

Relacionado con TC-PS-04 / TC-PS-07 · P1 (Crítica) · Regresión · Auto: Sí

**Prioridad:** P1 (Crítica)

**Pasos**

1. Ejecutar add to cart cuando el demo responde lento

**Resultado esperado:** Hasta 3 intentos (`clickAddToCartWithRetry`); señal de éxito o fallo explícito.

---

## TC-PS-09 — Modal post-add no bloquea el carrito

Relacionado con TC-PS-05 / TC-PS-07 · P1 (Crítica) · UI · Auto: Sí

**Prioridad:** P1 (Crítica)

**Pasos**

1. Tras add to cart, usar flujo de `CartPage.openCart()` con modal `#blockcart-modal`

**Resultado esperado:** Llegada a Shopping cart sin overlay bloqueando el header.

---

## TC-PS-10 — Checkout con carrito vacío

P2 (Importante) · Negativo · Auto: No

**Prioridad:** P2 (Importante)

**Pasos**

1. Ir al carrito sin productos
2. Intentar **Proceed to checkout**

**Resultado esperado:** No avanza a formulario de pedido; carrito vacío o redirección controlada.

---

## Matriz TC-PS-07 (ejecutado)

| Paso | Page Object | Helper |
|------|-------------|--------|
| Setup iframe | — | `waitForShopReady` |
| Clothes | `HomePage` | `getShopFrame` |
| Producto | `ProductPage` | — |
| Add to cart | `ProductPage` | `clickAddToCartWithRetry` |
| Carrito | `CartPage` | Modal / View cart |
| Checkout | `CartPage` | — |

---

## Datos de prueba

| Dato | Valor |
|------|-------|
| URL | `https://demo.prestashop.com/` |
| Categoría | Clothes |
| Producto | Hummingbird printed t-shirt |
| Usuario | Invitado |
| Ítems en carrito | 1 |
