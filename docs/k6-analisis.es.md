# Análisis K6 — PrestaShop

Guía para entender qué hace K6, qué significan los números del reporte y cómo interpretar los scripts de este lab.

**Última corrida (smoke):** `k6 run web/k6/prestashop-smoke.js` — **PASS**

---

## ¿Qué es K6?

K6 es una herramienta de **pruebas de carga**. Simula **varios usuarios a la vez** haciendo peticiones HTTP al sitio.

No abre navegador. No hace clics. No reemplaza Playwright.

| Herramienta | Qué prueba |
|-------------|------------|
| **Playwright** | ¿Funciona el flujo de compra? (UI, botones, carrito) |
| **Lighthouse** | ¿La página es rápida, accesible y bien hecha? (1 usuario, navegador) |
| **K6** | ¿El servidor aguanta cuando entran varios usuarios a la vez? (HTTP puro) |

---

```bash
# E2E + Lighthouse
cd web/playwright-ts && npm test

# Carga HTTP
k6 run web/k6/prestashop-smoke.js
```

En el lab viven en carpetas distintas: `web/playwright-ts/` y `web/k6/`.

---

## Scripts en este proyecto

### 1. `prestashop-smoke.js`

Perfil **conservador** para no saturar el demo público:

| Parámetro | Valor | Significado |
|-----------|-------|-------------|
| `vus` | 5 | 5 usuarios virtuales simultáneos |
| `duration` | 1m | Durante 1 minuto |
| Qué hace cada usuario | `GET` a la home + espera 2 s | Entra a la URL y repite en bucle |

**Umbrales (thresholds):**

| Umbral | Regla | En palabras simples |
|--------|-------|---------------------|
| `http_req_duration` | p(95) &lt; 5000 ms | El 95% de las peticiones tarda menos de 5 segundos |
| `errors` | rate &lt; 0.1 | Menos del 10% de errores |

### 2. `prestashop-browse.js` — extra (opcional)

Más agresivo: sube usuarios en rampa (5 → 10) y visita dos URLs. Umbrales más estrictos (p95 &lt; 3 s, errores &lt; 5%).

---

## Resultados de la última ejecución (smoke)

| Métrica | Valor | ¿Bien? |
|---------|-------|--------|
| Usuarios virtuales (VUs) | 5 | — |
| Duración | 1 minuto | — |
| Peticiones totales | 140 | — |
| Checks `home status 200` | **140/140 (100%)** | Sí |
| Peticiones fallidas HTTP | **0%** | Sí |
| Latencia media | ~167 ms | Muy bien |
| p(95) latencia | **173 ms** (límite 5000 ms) | Sí |
| Tasa de errores custom | **0%** (límite 10%) | Sí |
| **Veredicto thresholds** | **Todos PASS** | Sí |

**Conclusión:** con 5 usuarios durante 1 minuto, el demo respondió siempre con HTTP 200 y muy rápido.

---

## Métricas del reporte

### THRESHOLDS

Reglas definidas en el script. Si se rompen, el test **falla**.

### checks_total / checks_succeeded

Comprobaciones dentro del script (`check(...)`). En smoke: *¿status HTTP es 200?*

### http_req_duration

| Estadística | Qué es | Valor (aprox.) |
|-------------|--------|----------------|
| **avg** | Promedio | 167 ms |
| **med** | Mediana | 155 ms |
| **p(95)** | El 95% fue más rápido que esto | **173 ms** |
| **max** | La más lenta | 397 ms |

**p(95)** es clave en performance: captura la experiencia de **casi todos** los usuarios, no solo el promedio.

### http_req_failed

- **0%** = ninguna petición falló a nivel HTTP.

### iterations

Una **iteración** = un usuario ejecuta una vez la función `default` (GET + sleep 2 s). **140 iteraciones** en 1 min con 5 VUs.

### vus

Usuarios simulados **a la vez**. Máximo **5** en smoke.

---

## Qué hace el código (smoke)

```javascript
const BASE_URL = __ENV.BASE_URL || 'https://demo.prestashop.com/';
export const options = { vus: 5, duration: '1m', thresholds: { ... } };
const home = http.get(BASE_URL);
check(home, { 'home status 200': (r) => r.status === 200 });
sleep(2);
```

- `BASE_URL` configurable por entorno
- Cada VU hace GET a la home y pausa 2 s (realismo + no abusar del servidor)

---

## Load test vs stress test

| Tipo | Qué buscas | Este lab |
|------|------------|----------|
| **Load test** | Carga **esperada** o moderada | `prestashop-smoke.js` (5 VU) |
| **Stress test** | Hasta **romper** el sistema | No en demo público |
| **Smoke de carga** | ¿Aguanta un poco de tráfico? | Smoke = esto |

**Ética:** el demo de PrestaShop es compartido. Usamos **5 VUs, 1 minuto**.

---

## K6 vs Lighthouse

| | Lighthouse | K6 |
|---|------------|-----|
| Usuarios | 1 navegador | Muchos virtuales en paralelo |
| Mide | Calidad de página | Resistencia del servidor / red |
| Navegador | Sí | No |
| Demo PrestaShop iframe | Audita lo que ve el navegador | Solo pide la URL raíz por HTTP |

K6 en smoke **no** entra al iframe ni simula add-to-cart.

---

## ¿Qué significa para este lab?

| Pregunta | Respuesta |
|----------|-----------|
| ¿Falló K6? | **No** en la última corrida smoke. |
| ¿El servidor es infinito? | **No.** Solo carga **ligera**. |
| ¿Sustituye Playwright? | **No.** Complementa: funcional (E2E) + carga (K6). |

---

## Cómo volver a ejecutar

```bash
k6 run web/k6/prestashop-smoke.js
k6 run web/k6/prestashop-browse.js
BASE_URL=https://tu-staging.com k6 run web/k6/prestashop-smoke.js
```

---

## Glosario rápido

| Término | Significado |
|---------|-------------|
| **VU** | Usuario virtual que repite el script |
| **Iteration** | Una vuelta completa del script por un VU |
| **Threshold** | Regla de éxito/fallo al final del test |
| **p(95)** | El 95% de peticiones fue más rápido que este valor |
| **check** | Aserción dentro del script (ej. status 200) |
| **Load test** | Carga moderada/esperada |
| **Stress test** | Empujar hasta el límite del sistema |
