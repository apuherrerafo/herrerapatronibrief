# Resumen del proyecto — Brief Herrera & Patroni

Documento para tener una sola fuente de verdad y que cualquier asistente (p. ej. Claude) pueda ayudar sin perderse.

---

## Qué es el proyecto

- **Nombre:** Brief de Proyecto — Herrera & Patroni Design Studio.
- **Uso:** Los clientes (Cervera, Herrera, Patroni) entran con un código, rellenan un formulario largo (brief) por salas/espacios; pueden guardar borrador y enviar. El admin (código "cafeteria") ve en un backoffice los briefs recibidos por usuario, puede ver el texto y limpiar.
- **Deploy:** GitHub → Vercel. Repo: `apuherrerafo/herrerapatronibrief`, rama `main`.

---

## Stack actual (y por qué da problemas)

| Capa | Tecnología | Notas |
|------|------------|--------|
| **Frontend** | Un solo `index.html` (~2100 líneas) | HTML + CSS inline + **dos bloques de JS**: uno en `<head>` y otro en `<body>`. Sin framework (no React/Vue/Svelte). |
| **Estilos** | Tailwind (compilado a `assets/main.css`) | `npm run build:css` con `@tailwindcss/cli`. |
| **Backend local** | `node server.js` | Servidor estático (solo sirve archivos). **No** monta `/api/brief` en local. |
| **API en producción** | Vercel Serverless + `api/brief.js` | Solo en Vercel: GET/POST/DELETE a Supabase. En local, `useBriefApi()` es false → todo con `localStorage`. |
| **Base de datos** | Supabase | Tabla `briefs` (por usuario). Credenciales en env de Vercel. |

**Por qué han aparecido tantos bugs:**  
La lógica está repartida en **dos sitios**: script en `<head>` (login, delegación de clics, fallback del grid del admin) y script en `<body>` (applyRoute, handleLogin, saveProgress, renderUserCards, etc.). Mismo flujo depende de ambos; si uno se ejecuta antes o falla, el otro no compensa bien. Además, el orden de ejecución (DOMContentLoaded, hashchange, asignación de handlers) es fácil que se rompa al tocar una cosa.

---

## Estructura de archivos relevante

```
herrerapatronibrief/
├── index.html          # Todo: login, brief, panel admin (#login | #brief | #admin)
├── admin.html          # Existe; Vercel redirige /admin → admin.html (revisar si se usa)
├── server.js            # Servidor estático (no API)
├── api/
│   └── brief.js         # Handlers Vercel: Supabase GET/POST/DELETE
├── assets/
│   ├── main.css         # Tailwind compilado
│   └── videos/          # Video de login
├── vercel.json          # Rutas, buildCommand: npm run build:css
├── package.json         # tailwind, @supabase/supabase-js, serve: node server.js
└── supabase-briefs-table.sql
```

---

## Flujos principales

1. **Login cliente:** Código CERVERA/HERRERA/PATRONI → `#brief` → formulario con guardado en localStorage (y en producción también POST a `/api/brief`).
2. **Login admin:** Clic en "Backoffice" → `#admin` → subtítulo "Código de acceso administrativo" → código "cafeteria" → panel con 3 tarjetas (Cervera, Herrera, Patroni), Refrescar, Ver brief, Limpiar.
3. **Rutas:** `applyRoute()` (en body) lee `location.hash` y muestra login / brief / admin. `hashchange` llama a `applyRoute()`.

---

## Qué está arreglado (reciente)

- Login (Ingresar y Backoffice) con handlers en head y body; el body ahora hace Backoffice completo (hash + setLoginMode + applyRoute).
- Botones del brief (pills, radios, escalas, edad) por delegación de clic en el head.
- Guardar manual (saveProgress) sin depender de `briefLoaded` de forma bloqueante.
- Panel admin: fallback en head que pinta 3 tarjetas al mostrar admin; delegación de Refrescar, Salir, Ver brief, Limpiar; `renderUserCards()` en body.

---

## Qué puede seguir fallando o es frágil

- **Backoffice:** Si el script del head falla, el body ya cubre el clic en Backoffice; si algo más rompe (p. ej. `applyRoute` o `setLoginMode`), el botón puede dejar de responder.
- **Panel admin vacío:** Si `renderUserCards` no se ejecuta o falla, el fallback del head deja al menos 3 tarjetas "Sin datos".
- **Autoguardado:** Reportado como que no funcionaba; no se ha depurado con logs.
- **Orden de carga:** Dos `DOMContentLoaded` (head y body) y dependencia de `window.applyRoute` / `window.renderUserCards` desde el head.

---

## Recomendaciones para reducir bugs (para Claude / refactor)

1. **Unificar la lógica de login y rutas** en un solo lugar (idealmente todo en el body, o todo en un único JS externo que se cargue al final del body), y dejar en el head solo lo mínimo (p. ej. un loader o nada).
2. **Evitar duplicar** doLogin vs handleLogin, y el doble registro del clic en Backoffice (head onclick + body addEventListener). Un solo handler que haga: hash, setLoginMode, applyRoute.
3. **Considerar un stack más simple y mantenible:** por ejemplo una SPA mínima (React/Vue/Svelte) con un solo árbol de componentes y un solo router, o al menos un único `app.js` que inicialice todo después de DOMContentLoaded.
4. **Local:** Si se quiere probar el backoffice con datos de la API en local, hace falta un proxy o montar `api/brief.js` en el servidor local (ahora `useBriefApi()` es false en localhost).

---

## Cómo probar

- **Local:** Ejecutar tarea Cursor "Servidor H&P Brief" (o `node server.js`), abrir `http://localhost:8080` (o el puerto que use). Admin con código "cafeteria"; en local los briefs son solo localStorage (no Supabase).
- **Producción:** Deploy en Vercel; API y Supabase activos. Deploy: desde Cursor, "deploy vercel" (MCP) o push a `main`.

---

## Variables y constantes útiles (en index.html)

- **Session:** `SESSION_KEY = 'hp_session'` (localStorage).
- **Códigos:** Clientes `CERVERA` / `HERRERA` / `PATRONI` → usuarios `cervera` / `herrera` / `patroni`; admin `cafeteria`.
- **IDs DOM:** `loginScreen`, `loginBackofficeBtn`, `loginBtn`, `loginInput`, `loginSubtitle`, `adminTopbar`, `adminApp`, `usersGrid`, `mainApp`, `topbar`, `progressBar`, `briefForm`, `saveBtn`, `btnRefrescarBriefs`, `btnLogout`, `.user-card`, `.btn-view`, `.btn-clear`.

Si alguien (o Claude) va a tocar login, rutas o backoffice, conviene leer este resumen y luego buscar en `index.html` por estos IDs y por `applyRoute`, `handleLogin`, `renderUserCards`, `doLogin`.
