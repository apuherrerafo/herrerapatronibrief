# Skill: Compilar Tailwind CSS

## Cuándo usar
Después de agregar o modificar clases de Tailwind en los archivos HTML, o al modificar `src/input.css`.

## Comando de build
```bash
npm run build:css
```

Esto ejecuta:
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./assets/main.css --minify
```

## Flujo
1. `src/input.css` es la fuente (imports, variables, `@theme`, `@layer components`).
2. Tailwind escanea los HTML (configurado con `@source "../*.html"` en `input.css`).
3. El output compilado y minificado va a `assets/main.css`.

## Cuándo es necesario recompilar

| Cambio | ¿Recompilar? |
|--------|-------------|
| Agregar clase Tailwind en HTML (ej: `class="mt-4 text-sm"`) | Sí |
| Modificar variables CSS en `src/input.css` | Sí |
| Agregar componente en `@layer components` | Sí |
| Cambiar estilos inline en `<style>` del HTML | No |
| Cambiar solo JavaScript | No |
| Cambiar contenido de texto | No |

## Troubleshooting

### "No se ven los estilos nuevos"
1. Verificar que `npm run build:css` se ejecutó sin errores.
2. Verificar que el HTML enlaza `/assets/main.css` (no otra ruta).
3. Hard refresh en el navegador (Cmd+Shift+R).

### "npm run build:css falla"
1. Verificar que `node_modules` existe: `ls node_modules/.package-lock.json`
2. Si no: `npm install` primero.
3. Verificar versión de Node (requiere Node 18+).

### "La clase existe pero no aplica estilos"
- Tailwind v4 solo genera CSS para clases que encuentra en los archivos escaneados.
- Verificar que `@source "../*.html"` incluye el archivo donde usas la clase.
- Las clases generadas dinámicamente con JS (ej: template literals) no son detectadas; usar clases completas.

## Notas
- No editar `assets/main.css` directamente; se sobrescribe al compilar.
- El build solo procesa CSS, no JS ni HTML.
- En producción (Vercel), el build se ejecuta automáticamente vía `vercel.json` → `buildCommand`.
