# H&P Brief — Herrera & Patroni Design Studio

Formulario de brief para clientes + panel administrativo. Proyecto estático (HTML, CSS, JS), sin backend.

## Estructura

```
hp-brief/
├── index.html      → Formulario de brief (clientes)
├── admin.html      → Panel administrativo (backoffice)
├── vercel.json     → Rutas para Vercel
└── README.md
```

## Códigos de acceso

| Quién | Código |
|-------|--------|
| Cliente Cervera | `CERVERA` |
| Cliente Herrera | `HERRERA` |
| Cliente Patroni | `PATRONI` |
| Admin (backoffice) | `cafeteria` |

## Tester E2E (Playwright)

Hay tests automatizados que comprueban login, panel admin, errores de API y flujo Ver/Limpiar.

**Cómo ejecutarlo:**

- **Opción A — Tarea en Cursor:** `Ctrl+Shift+P` → "Tasks: Run Task" → **"Ejecutar tests E2E (Playwright)"**. (La primera vez descargará Chromium.)
- **Opción B — Terminal:** Abre la terminal (`` Ctrl+` ``), ve a la carpeta del proyecto y ejecuta:
  ```bash
  npx playwright install chromium   # solo la primera vez
  npm run test
  ```
  (Si el servidor no está en marcha, Playwright lo arranca en el puerto 8081.)

- **Interfaz visual:** `npm run test:ui`

## Cómo ver el proyecto en local

1. **Opción A — Tarea en Cursor:** Ctrl+Shift+P → "Run Task" → "Servidor H&P Brief". Luego abre http://localhost:8080
2. **Opción B — Doble clic:** Ejecuta `servidor-fullpath.bat` en esta carpeta (requiere Node instalado).
3. **Opción C — Sin servidor:** Abre `index.html` o `admin.html` directamente en el navegador (file://).

## Subir a GitHub

- **Tarea en Cursor:** Ctrl+Shift+P → Run Task → **Subir a GitHub**
- **Manual:** doble clic en `push-github.bat` (o ejecutar `diagnostico-github.bat` para ver el error exacto)

**Si falla:**

1. **"git no se reconoce"** — Git no está en el PATH. Instala desde [git-scm.com/download/win](https://git-scm.com/download/win) (instalación estándar en `C:\Program Files\Git`). Si está en otra ruta, edita `push-github.bat` y añade esa carpeta al inicio.
2. **Pide usuario/contraseña** — GitHub ya no acepta contraseña de la cuenta. Crea un [Personal Access Token](https://github.com/settings/tokens) (permiso `repo`) y úsalo como contraseña al hacer push.
3. **"repository not found"** — Comprueba que [github.com/apuherrerafo/herrerapatronibrief](https://github.com/apuherrerafo/herrerapatronibrief) existe y que tu usuario tiene permiso de escritura.

## Deploy en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Conectar el repo de GitHub o arrastrar esta carpeta
3. Deploy

URLs en producción: `tudominio.vercel.app/` (brief) y `tudominio.vercel.app/admin` (admin).

## Backoffice en Vercel: que el admin vea los briefs de todos

En local todo se guarda solo en el navegador. En **Vercel** los briefs se copian también al servidor (Vercel Blob) para que el backoffice muestre los datos de cada cliente aunque hayan entrado desde otro dispositivo.

**Pasos (solo una vez):**

1. Entra a [vercel.com](https://vercel.com) e inicia sesión.
2. Abre tu proyecto **herrerapatronibrief** (o el nombre que tenga).
3. Arriba ve a la pestaña **Storage** (o en el menú del proyecto: **Storage**).
4. Pulsa **Create Database** (o **Add Storage** / **Connect Store**).
5. Elige **Blob** y sigue el asistente:
   - Nombre del store: por ejemplo `briefs`.
   - Entorno: **Production** (y si quieres también Preview).
   - Crear.
6. Cuando pregunte **a qué proyecto enlazar**, selecciona **herrerapatronibrief** y confirma.
7. Vercel añadirá la variable **BLOB_READ_WRITE_TOKEN** al proyecto. No hace falta copiarla a mano.
8. **Conectar el store al proyecto:** En la página del store "briefs", busca **"Connect to Project"** o **"Link to Project"** y selecciona **herrerapatronibrief**. Así Vercel añade `BLOB_READ_WRITE_TOKEN` al proyecto.
9. Haz un **nuevo deploy**: **Deployments** → menú (⋯) del último deploy → **Redeploy**. (Sin redeploy la función no ve la variable nueva.)

**Si sigue sin funcionar:** Entra a **Settings** → **Environment Variables**. Debe existir `BLOB_READ_WRITE_TOKEN` y tener marcado **Production**. Si no está, en **Storage** → tu store "briefs" → **Connect to Project** de nuevo y vuelve a hacer **Redeploy**.

Después de eso, cuando un cliente guarde o envíe el brief en la URL de Vercel, los datos se guardarán en Blob y tú los verás en el backoffice al entrar a tu URL de Vercel.

## Datos

- **En local:** todo en `localStorage` del navegador. El admin ve/limpia briefs solo en ese navegador.
- **En Vercel:** además de `localStorage`, se envía una copia a la API (Blob) para que el backoffice muestre los briefs de todos los clientes.
