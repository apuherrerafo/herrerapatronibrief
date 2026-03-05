# Skill: Exportar datos del brief

## Cuándo usar
Cuando el usuario pide una forma de exportar, descargar o compartir los datos del brief fuera del navegador.

## Contexto
Actualmente los datos viven solo en `localStorage`. No hay backend. Las opciones de exportación son client-side.

## Opciones de exportación

### 1. Copiar al clipboard (ya implementado)
- `admin.html` ya tiene un botón "Copiar texto" que copia `briefContent.innerText`.
- `index.html` admin embebido tiene lo mismo.

### 2. Descargar como archivo de texto (.txt)
```js
function downloadBrief(user) {
  const data = getUserData(user);
  const text = data.report || JSON.stringify(data.progress, null, 2) || 'Sin datos';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brief-${user}-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### 3. Descargar como JSON
```js
function downloadBriefJSON(user) {
  const data = getUserData(user);
  const payload = {
    user,
    exportedAt: new Date().toISOString(),
    report: data.report,
    state: data.progress,
    submittedAt: data.submittedAt ? new Date(data.submittedAt).toISOString() : null,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brief-${user}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### 4. Generar PDF (via window.print)
```js
function printBrief() {
  window.print();
}
```
Agregar estilos `@media print` para ocultar topbar, botones, y mostrar solo el contenido del brief.

## Dónde agregar la funcionalidad

- **Admin panel (`admin.html`):** junto al botón "Copiar texto" en `.brief-viewer-actions`.
- **Admin embebido en `index.html`:** misma ubicación, `.brief-viewer-actions`.
- Mantener ambos archivos sincronizados.

## Botón de descarga (estilo consistente)
```html
<button class="btn-copy" onclick="downloadBrief('{user}')">Descargar .txt</button>
```
Reutilizar la clase `.btn-copy` para mantener el estilo visual.
