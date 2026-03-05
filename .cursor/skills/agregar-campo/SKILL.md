# Skill: Agregar un campo a una sección existente

## Cuándo usar
Cuando el usuario pide agregar una pregunta, opción o campo nuevo a una sección que ya existe en el brief.

## Inputs requeridos
- **Sección destino** (ej: "Sala – Comedor", "Cocina")
- **Tipo de campo**: pill, radio, scale, textarea, age
- **Opciones** (para pill/radio): lista de valores
- **Nombre del campo** para el atributo `name` o `id`

## Plantillas por tipo

### Pill group (multi-select)
```html
<div class="q-block">
  <span class="q-label">Pregunta</span>
  <div class="pill-row" id="{seccion}-{campo}">
    <span class="pill" data-val="Opción A">Opción A</span>
    <span class="pill" data-val="Opción B">Opción B</span>
    <span class="pill otros-trigger" data-target="{seccion}-{campo}-otros">Otros</span>
  </div>
  <div class="sub-field" id="{seccion}-{campo}-otros">
    <textarea class="text-field" name="{seccion}_{campo}_otros" placeholder="¿Cuáles otros?" rows="2"></textarea>
  </div>
</div>
```
**State key:** `pills__{seccion}-{campo}` → array de strings

### Radio group (single-select)
```html
<div class="q-block">
  <span class="q-label">Pregunta</span>
  <div class="radio-group" id="{seccion}-{campo}-group">
    <div class="radio-item" data-val="Opción A"><span class="radio-dot"></span> Opción A</div>
    <div class="radio-item" data-val="Opción B"><span class="radio-dot"></span> Opción B</div>
  </div>
</div>
```
**State key:** `radio__{seccion}-{campo}-group` → string

**Con sub-field condicional** (se muestra al seleccionar cierta opción):
```html
<div class="sub-field" id="{seccion}-{campo}-detail">
  <textarea class="text-field" name="{seccion}_{campo}_detalle" placeholder="Detalle..." rows="2"></textarea>
</div>
```
Y registrar en `radioSubMap`:
```js
'{seccion}-{campo}-group': { show: ['Sí'], target: '{seccion}-{campo}-detail' },
```

### Textarea libre
```html
<div class="q-block">
  <span class="q-label">Pregunta</span>
  <textarea class="text-field" name="{seccion}_{campo}" placeholder="..." rows="2"></textarea>
</div>
```
**State key:** `text__{seccion}_{campo}` → string

### Textarea con hint
```html
<div class="q-block">
  <span class="q-label">Pregunta</span>
  <p class="q-hint">Texto de ayuda para el usuario.</p>
  <textarea class="text-field" name="{seccion}_{campo}" placeholder="..." rows="3"></textarea>
</div>
```

## Checklist post-campo

1. **HTML insertado** en la sección correcta de `index.html`.
2. Si es radio con sub-field → agregado en `radioSubMap`.
3. **`buildReport()` actualizado** — nueva entrada en `labelMap` con formato `'Sección · Campo'`.
4. **`renderStateHTML()` actualizado** en `index.html` — nueva entrada en `labelMap` con formato `['Sección', 'Campo']`.
5. **`renderStateHTML()` actualizado** en `admin.html` — misma entrada que el punto anterior.
6. Si el campo usa clases Tailwind nuevas → `npm run build:css`.

## Convención de naming

- **IDs HTML:** kebab-case con prefijo de sección: `{seccion}-{campo}` (ej: `cocina-estilo`)
- **name de textarea/input:** snake_case con prefijo: `{seccion}_{campo}` (ej: `cocina_estilo`)
- **State keys:** automáticos por tipo (`pills__`, `radio__`, `text__`, `scale__`)
