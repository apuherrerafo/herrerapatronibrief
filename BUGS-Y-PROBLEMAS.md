# Bugs y problemas — Brief Herrera & Patroni

Listado de fallos conocidos, comportamientos raros y deudas técnicas para priorizar y arreglar (o para que un asistente sepa por dónde empezar).

---

## Bugs activos / reportados

### 1. Panel admin (backoffice) sale vacío
- **Qué pasa:** En "Briefs recibidos" a veces no se ven las tarjetas (Cervera, Herrera, Patroni).
- **Causa probable:** `renderUserCards()` (en el body) no se ejecuta a tiempo o falla; el grid `#usersGrid` queda vacío.
- **Parche actual:** En el head hay un fallback que, al mostrar la vista admin, rellena el grid con 3 tarjetas "Sin datos". Si aun así sale vacío, puede que falle algo antes (p. ej. `#usersGrid` no exista en el DOM en ese momento).

### 2. Botón Backoffice no funciona (intermitente)
- **Qué pasa:** Al hacer clic en "Backoffice" a veces no cambia la pantalla ni el subtítulo.
- **Causa:** Lógica duplicada: handler en el head (onclick) y en el body (addEventListener). Si el script del head falla o no se ejecuta, solo el body hace `hash = 'admin'`; si no se llama `applyRoute()` o `setLoginMode('admin')`, no se ve el cambio.
- **Parche actual:** El body ahora hace todo (hash + setLoginMode + applyRoute) en el listener del Backoffice. Si sigue fallando, revisar errores en consola al cargar o al hacer clic.

### 3. Autoguardado no funciona / no se nota
- **Qué pasa:** El usuario indicó que el autoguardado (estilo Docs/Sheets) no funciona.
- **Estado:** No se ha depurado con logs; no está claro si no guarda, no sincroniza con la API, o solo no se muestra el feedback ("Guardado…").
- **Dónde mirar:** `scheduleAutoSave`, `saveProgressSilent`, listeners de `input`/`change` en el formulario, y en producción `apiSyncBrief` / `useBriefApi()`.

### 4. Otros botones del admin (Refrescar, Salir, Ver brief, Limpiar)
- **Qué pasa:** En el pasado no respondían.
- **Parche actual:** Delegación de clics en el head (por id y por clase). Si algo del head falla antes de registrar esos listeners, los botones pueden volver a no responder.
- **Revisar:** Que no haya errores JS en el head que corten la ejecución antes de `document.addEventListener('click', ...)`.

---

## Problemas de diseño / fragilidad

### 5. Dos bloques de JS (head + body)
- **Problema:** Toda la lógica está repartida entre un script en `<head>` y otro en `<body>`. El orden de ejecución depende de DOMContentLoaded y de que el body esté parseado; es fácil que un cambio rompa algo en el otro bloque.
- **Consecuencia:** Bugs que "aparecen solos" al tocar login, rutas o backoffice (p. ej. botón Backoffice, panel vacío).

### 6. Login duplicado: doLogin (head) vs handleLogin (body)
- **Problema:** Dos implementaciones de login: `doLogin` en el head y `handleLogin` en el body. El botón "Ingresar" puede estar conectado a uno u otro según asignaciones y orden de carga.
- **Consecuencia:** Comportamiento inconsistente; difícil saber qué función se ejecuta en cada caso.

### 7. Dependencia de funciones del body desde el head
- **Problema:** El head llama a `window.applyRoute`, `window.renderUserCards`, `window.loadBriefsFromApi`, etc. Si el script del body no ha corrido aún (o falla), esas funciones no existen y el head solo comprueba `typeof ... === 'function'` y sigue sin hacer nada.
- **Consecuencia:** Pantallas que no se actualizan o no muestran datos sin un error claro.

### 8. API solo en producción
- **Problema:** `useBriefApi()` devuelve false en localhost. En local todo es localStorage; el backoffice en local no ve datos guardados en Supabase.
- **Consecuencia:** No se puede probar el flujo completo (guardar → ver en admin) sin desplegar a Vercel o montar la API en local.

---

## Deudas técnicas

### 9. Un solo HTML muy grande
- **Problema:** `index.html` tiene ~2100 líneas (HTML + CSS + dos bloques JS). Difícil de mantener y de depurar.
- **Idea:** Extraer JS a uno o varios archivos; un solo punto de entrada (p. ej. `app.js`) que registre listeners y arranque la app.

### 10. admin.html y rutas
- **Problema:** Existe `admin.html` y en `vercel.json` hay ruta `/admin` → `admin.html`. La app principal usa `index.html` con `#admin`. Puede haber confusión: ¿se usa admin.html o solo index.html#admin?
- **Revisar:** Si admin.html se usa, documentar el flujo; si no, unificar todo en index.html#admin y quitar la ruta si hace falta.

---

## Cómo usar este documento

- **Para arreglar:** Priorizar 1–4 (bugs de usuario); 5–8 explican por qué pasan y qué tocar.
- **Para refactor:** 5–7 y 9 son el núcleo (unificar lógica, un solo JS, evitar duplicados).
- **Para probar bien:** 8 y 10 (API en local, aclarar admin.html).

Si un asistente (p. ej. Claude) va a tocar algo relacionado con login, backoffice o guardado, conviene que lea también `RESUMEN-PROYECTO.md` para tener el contexto del stack y los flujos.
