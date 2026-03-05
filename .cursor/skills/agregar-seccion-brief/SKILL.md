# Skill: Agregar una sección al brief

## Cuándo usar
Cuando el usuario pide agregar un nuevo espacio/habitación al formulario del brief (ej: "agrega una sección para Terraza", "añade el Estudio").

## Inputs requeridos
- **Nombre de la sección** (ej: "Terraza", "Estudio", "Lavandería")
- **Prefix** para IDs (ej: `terraza`, `estudio`, `lavanderia`) — derivar del nombre si no se proporciona
- **Número de sección** — ver cuál es el último número en el HTML y usar el siguiente

## Pasos

### 1. Leer el estado actual
- Abrir `index.html` y localizar la última `<div class="section">` antes de `<!-- SUBMIT -->`.
- Identificar el número de sección actual más alto (`section-num`).

### 2. Crear el HTML de la sección
Insertar justo antes de `<!-- SUBMIT -->` en `index.html`:

```html
<!-- ═══════════════════════════════════════
     NN · NOMBRE EN MAYÚSCULAS
═══════════════════════════════════════ -->
<div class="section">
  <div class="section-header">
    <span class="section-num">NN</span>
    <h2 class="section-title">Nombre de la Sección</h2>
  </div>

  <!-- Muebles que se reutilizan (si aplica) -->
  <div class="q-block">
    <span class="q-label">Muebles actuales que se reutilizan</span>
    <div class="pill-row" id="{prefix}-muebles">
      <span class="pill" data-val="Opción 1">Opción 1</span>
      <span class="pill" data-val="Opción 2">Opción 2</span>
      <span class="pill" data-val="Ninguno">Ninguno</span>
      <span class="pill otros-trigger" data-target="{prefix}-muebles-otros">Otros</span>
    </div>
    <div class="sub-field" id="{prefix}-muebles-otros">
      <textarea class="text-field" name="{prefix}_muebles_otros" placeholder="¿Qué otros muebles se reutilizan?" rows="2"></textarea>
    </div>
  </div>

  <!-- Notas adicionales -->
  <div class="q-block">
    <span class="q-label">Notas adicionales</span>
    <textarea class="text-field" name="{prefix}_notas" placeholder="Algo específico que quieran lograr en este espacio…" rows="2"></textarea>
  </div>

  <!-- Prioridad -->
  <div class="q-block">
    <span class="q-label">Prioridad de inversión en este espacio</span>
    <div class="scale-row" id="s-{prefix}"></div>
    <div class="scale-labels"><span>1 — Menor</span><span>5 — Mayor</span></div>
  </div>
</div>
```

### 3. Registrar la escala en JS
En el array `scaleConfigs` (dentro del `<script>` de `index.html`), agregar:
```js
{ id: 's-{prefix}', name: '{prefix}_prioridad' },
```

### 4. Actualizar `buildReport()` en `index.html`
Agregar las entradas al objeto `labelMap` dentro de `buildReport()`:
```js
'pills__{prefix}-muebles':    'Nombre · Muebles a reutilizar',
'text__{prefix}_muebles_otros': 'Nombre · Muebles (otros)',
'text__{prefix}_notas':        'Nombre · Notas',
'scale__{prefix}_prioridad':   'Nombre · Prioridad de inversión',
```

### 5. Actualizar `renderStateHTML()` en `index.html`
Agregar al `labelMap` de `renderStateHTML()`:
```js
'pills__{prefix}-muebles':    ['Nombre', 'Muebles a reutilizar'],
'text__{prefix}_muebles_otros': ['Nombre', 'Muebles (otros)'],
'text__{prefix}_notas':        ['Nombre', 'Notas'],
'scale__{prefix}_prioridad':   ['Nombre', 'Prioridad'],
```

### 6. Actualizar `admin.html`
Agregar las **mismas entradas** al `labelMap` de `renderStateHTML()` en `admin.html`.

### 7. Verificar
- Repasar que los IDs no colisionen con secciones existentes.
- Si se agregaron clases Tailwind nuevas, ejecutar `npm run build:css`.

## Errores comunes a evitar
- Olvidar registrar la escala en `scaleConfigs` (las bolitas 1–5 no aparecerán).
- Olvidar actualizar `admin.html` (el admin no mostrará los datos de la nueva sección).
- Usar un `id` que ya existe en otra sección (ej: `muebles` sin prefix).
- No agregar campos al `labelMap` de `buildReport()` (el reporte final omitirá esos datos).
