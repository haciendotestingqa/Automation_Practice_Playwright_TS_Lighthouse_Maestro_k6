# Practical Automation Lab

[English](README.en.md)

Demostración de prácticas de automatización y otras pruebas sobre proyectos demo de acceso gratuito. Sin entornos propios ni APIs privadas: todo apunta a targets públicos listos para practicar.

## Targets demo

| Área | Proyecto | URL |
|------|----------|-----|
| Web E2E, Lighthouse, K6 | PrestaShop Live Demo | [demo.prestashop.com](https://demo.prestashop.com/) |
| Mobile Maestro | FrontRow (React Native) | [github.com/majdukovic/frontrow](https://github.com/majdukovic/frontrow) |

## Prácticas incluidas

### E2E web — Playwright (JavaScript y TypeScript)

Flujo de compra en PrestaShop: categoría → producto → carrito → checkout invitado. Incluye Page Object Model, fixture para esperar el aprovisionamiento de la tienda demo y helpers compartidos en `web/shared/`.

### Auditorías Lighthouse

Rendimiento, accesibilidad, best practices y SEO en home, producto y carrito. Reportes generados en `lighthouse-reports/` (no versionados).

### Pruebas de carga — K6

- **Smoke:** validación de disponibilidad con carga mínima
- **Browse:** navegación por categorías y productos con tráfico conservador

### Mobile — Maestro

Smoke suite en FrontRow: lanzamiento, navegación de eventos, login y compra de tickets. YAML en `mobile/tests/maestro/`; la app se clona localmente en `mobile/frontrow/` (no versionada).

## Estructura

```text
web/playwright-js/   → E2E JavaScript
web/playwright-ts/   → E2E TypeScript + Lighthouse
web/shared/          → Constantes y helpers compartidos
web/k6/              → Scripts de carga
mobile/tests/maestro/ → Flows Maestro versionados
mobile/scripts/       → Utilidades de ejecución
docs/                → Casos de prueba y análisis de ejecuciones
```

## Comandos

```bash
# E2E JavaScript
cd web/playwright-js && npm install && npm test

# E2E TypeScript
cd web/playwright-ts && npm install && npm test

# Lighthouse (workers=1)
cd web/playwright-ts && npx playwright test tests/lighthouse --workers=1

# K6
k6 run web/k6/prestashop-smoke.js
k6 run web/k6/prestashop-browse.js

# Maestro smoke (FrontRow clonado en mobile/frontrow + emulador activo)
./mobile/scripts/run-android-smoke.sh   # Android (5 flows)
./mobile/scripts/run-ios-smoke.sh       # iOS (4 flows)
```

Setup mobile detallado en [mobile/README.md](mobile/README.md).

## Documentación

| Español | English |
|---------|---------|
| [Casos E2E PrestaShop](docs/prestashop-e2e-test-cases.es.md) | [PrestaShop E2E test cases](docs/prestashop-e2e-test-cases.en.md) |
| [Análisis Lighthouse](docs/lighthouse-analisis.es.md) | [Lighthouse analysis](docs/lighthouse-analisis.en.md) |
| [Análisis K6](docs/k6-analisis.es.md) | [K6 analysis](docs/k6-analisis.en.md) |

## Notas

- PrestaShop demo se provisiona bajo demanda; los tests esperan el boot automáticamente.
- K6 y Lighthouse usan carga conservadora contra el demo público.
