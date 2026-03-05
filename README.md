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

## Datos

Todo se guarda en `localStorage` del navegador, aislado por usuario. El admin puede ver y limpiar los briefs de cada cliente.
