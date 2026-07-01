# Calculator (calculator-practice-js)

A simple calculator built with **HTML**, **CSS**, and **JavaScript**.
This project is part of my journey learning web development from scratch.

---

## File: `index.html`

### What it does

This is the **structure** (like the skeleton) of the calculator. It defines all the buttons, the screen (display), and how they are organized. It does NOT have styles (colors, sizes) or logic (math operations) yet — that comes in the CSS and JS files.

---

### Tags and elements explained

#### `<!DOCTYPE html>`
Tells the browser: "Hey, this is an HTML5 document."

#### `<html lang="en">`
The root element of the page. `lang="en"` means the content is in English.

#### `<head>`
Container for metadata — stuff the user doesn't see but the browser needs.

| Tag | What it does |
|------|-------------|
| `<meta charset="UTF-8">` | Supports special characters like ñ, á, etc. |
| `<meta name="viewport">` | Makes it look good on mobile screens. |
| `<title>Calculator</title>` | Text that appears on the browser tab. |
| `<link rel="stylesheet">` | Connects the CSS file (`style.css`) to give the page colors and layout. |

#### `<body>`
Everything visible on the page goes here.

#### `<div class="calculator">`
A **container** (box) that holds everything — the screen and all buttons. It helps group things together so they're easy to style later.

#### `<div class="display">`
The **screen** of the calculator. Shows the numbers.

Inside it there are two parts:
- `previous-operand` — the number that was typed before pressing an operator.
- `current-operand` — the number being typed right now. Starts at `0`.

#### `<button class="...">`

Each button has a **class** that says what type of button it is:

| Button text | Class(es) | Purpose |
|-------------|-----------|---------|
| `AC` | `span-two clear` | Resets everything (All Clear). `span-two` means it takes 2 columns wide. |
| `DEL` | `delete` | Deletes the last digit typed. |
| `÷` `×` `−` `+` | `operator` | Math operators (divide, multiply, subtract, add). |
| `7` `8` `9` `4` `5` `6` `1` `2` `3` `0` | `number` | Number buttons. |
| `.` | `decimal` | Adds a decimal point. |
| `=` | `span-two equals` | Calculates the result. Also 2 columns wide. |

#### `<script src="script.js"></script>`
Connects the JavaScript file that will make the buttons actually work. It goes at the bottom so the HTML loads first.

---

---

## File: `style.css`

### What it does

This file gives **colors, sizes, and layout** to the calculator. It's the "skin and bones" — makes buttons round, arranges them in a grid, adds the blue pastel theme, and creates hover/click animations.

---

### Sections explained

#### 1. Global reset (`*`)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
Removes the default spacing that browsers add automatically. `box-sizing: border-box` makes padding count inside the element's total width (easier to calculate sizes).

#### 2. Body — background gradient
```css
background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
```
Creates a diagonal gradient from very light blue to medium pastel blue.
- `display: flex` + `justify-content: center` + `align-items: center` → centers the calculator in the middle of the screen.

#### 3. `.calculator` — the grid container
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 12px;
```
- `grid` — organizes the buttons in rows and columns.
- `repeat(4, 1fr)` — creates 4 columns of equal width. `1fr` = one fraction of the available space.
- `gap: 12px` — space between each button.
- `border-radius: 24px` — rounds the corners of the whole calculator.
- `box-shadow` — adds a soft blue shadow around it to make it "float."

#### 4. `.display` — the screen
```css
grid-column: 1 / -1;
```
- Spans from column 1 to the last column (`-1`), so it takes the full width.
- `text-align: right` — numbers appear on the right side (like a real calculator).
- `flex-direction: column` — stacks the two number lines (previous/current) vertically.

#### 5. Buttons — base style
```css
border-radius: 50%;     /* makes buttons perfectly round */
aspect-ratio: 1 / 1;    /* forces height = width */
transition: all 0.15s ease;
```
- `border-radius: 50%` — turns square buttons into circles.
- `aspect-ratio: 1 / 1` — ensures the button stays a perfect square (otherwise it might stretch).
- `transition` — makes hover and click effects smooth instead of instant.

#### 6. `.span-two` — wide buttons (AC and =)
```css
border-radius: 999px;   /* pill shape instead of circle */
aspect-ratio: auto;     /* removes the square forcing */
grid-column: span 2;    /* takes 2 columns in the grid */
```
- Since AC and = are wider, they use a very high `border-radius` to become capsules (pills), not circles.
- `grid-column: span 2` — tells the grid: "this button occupies 2 column spaces."

#### 7. Hover & active effects

| Selector | When? | What happens |
|----------|-------|--------------|
| `.number:hover` | Mouse passes over | Background gets brighter, adds a glow shadow, slightly enlarges (`scale(1.06)`) |
| `.number:active` | Click is pressed | Slightly shrinks (`scale(0.95)`) to simulate a physical button press |
| `.operator:hover` | Mouse passes over | Turns brighter, text turns white |
| `.equals:hover` | Mouse passes over | Glows more intensely with a blue shadow |
| `.clear:hover` / `.delete:hover` | Mouse passes over | Brighter background + subtle glow |

The `:hover` effect uses `box-shadow` with a semi-transparent blue color. This creates the "light" or "glow" effect you wanted.

#### 8. Media query (`@media (max-width: 400px)`)
Makes the calculator smaller on phones — reduces padding, gaps, and font sizes so everything still fits.

---

### Color palette (azules pastel / celestes)

| Element | Color | Hex |
|---------|-------|-----|
| Page background (gradient) | Very light → light blue | `#E3F2FD` → `#BBDEFB` |
| Calculator body | White | `#FFFFFF` |
| Display background | Ice blue | `#F5F9FF` |
| Number buttons | Light pastel blue | `#E3F2FD` |
| Number hover | Brighter pastel | `#BBDEFB` |
| Operator buttons | Medium pastel blue | `#90CAF9` |
| Operator hover | Bright blue | `#64B5F6` |
| Equals button | Vibrant blue | `#42A5F5` |
| Equals hover | Rich blue | `#1E88E5` |
| Clear / Delete | Steel blue tones | `#B0C4DE` / `#D4E4F7` |
| Text | Dark navy | `#1A3A5C` |

---

---

## File: `script.js`

### Part 1 — State (el estado)

Son las **variables globales** que guardan todo lo que la calculadora necesita recordar.

```js
let currentValue = '0';
```

| Variable | Tipo | ¿Qué guarda? | Ejemplo |
|----------|------|--------------|---------|
| `currentValue` | string | El número que se está escribiendo **ahora** en la pantalla grande | `'0'` → `'7'` → `'78'` → `'78.5'` |
| `previousValue` | string | El número que se escribió **antes** de presionar un operador | `''` → `'10'` → se usa en el cálculo y se limpia |
| `operator` | string o null | Qué operación se va a hacer | `null` → `'+'` → `'−'` → `'×'` → `'÷'` |
| `shouldResetScreen` | boolean | Si la pantalla debe reiniciarse al escribir el próximo número | `false` → `true` (después de operador) → `false` (después de escribir) |

### ¿Por qué `currentValue` es string y no number?

Porque queremos control exacto sobre lo que se muestra. Si el usuario escribe `0` luego `5` luego `.` luego `3`, concatenamos strings: `'0' + '5'` = `'05'` (no queremos que JS convierta a número y quite el cero). Después, al hacer la cuenta, convertimos a número con `parseFloat()`.

### ¿Qué hace `shouldResetScreen`?

Cuando el usuario presiona un operador (+ − × ÷), la pantalla debe mostrar el **próximo número** desde cero, no seguir concatenando. `shouldResetScreen = true` le dice a `inputNumber`: "la próxima vez que escriban un número, borra lo que hay y empieza de nuevo".

Ejemplo:
1. Escribo `10` → `currentValue = '10'`
2. Presiono `+` → `operator = '+'`, `previousValue = '10'`, `shouldResetScreen = true`
3. Escribo `5` → como `shouldResetScreen = true`, ahora `currentValue = '5'` (no `'105'`)
4. Presiono `=` → calcula `10 + 5` = `15`

---

## What I've learned so far

### HTML
- HTML is the **structure** of the page — like the walls and rooms of a house.
- Tags like `<div>` are boxes that group content.
- The `class` attribute is a label to identify elements (for CSS and JS).
- `<link>` connects external files (CSS), `<script>` connects external logic (JS).
- `span-two` is a custom class I invented to make some buttons wider.

### CSS
- `display: grid` and `grid-template-columns` arrange elements in a table-like layout.
- `gap` adds spacing between grid items — no more manual margins!
- `border-radius: 50%` makes a square element into a circle.
- `aspect-ratio` forces an element's height to match its width (great for round buttons).
- `:hover` and `:active` are **pseudo-classes** that detect mouse interaction.
- `transition` smooths out changes between states (hover → normal).
- `transform: scale()` makes elements grow or shrink visually.
- `@media (max-width)` creates **responsive** styles for different screen sizes.

### Design concepts
- A **gradient** (`linear-gradient`) blends two or more colors for a smooth background.
- **Box-shadow** adds depth — makes elements look like they're floating.
- **Pastel colors** are soft, low-saturation versions of bright colors. They feel calm and modern.

---

### Part 2 — Render (pintar en pantalla)

```js
function updateDisplay() {
  document.querySelector('.current-operand').textContent = currentValue;
  document.querySelector('.previous-operand').textContent =
    previousValue + (operator || '');
}
```

| Cosa | Qué hace |
|------|----------|
| `document.querySelector('.current-operand')` | Busca en el HTML el primer elemento que tenga la clase `current-operand` |
| `.textContent = ...` | Cambia el texto de ese elemento |
| `operator \|\| ''` | Si operator es `null`, muestra string vacío `''`. Si es `'+'`, muestra `'+'` |

`updateDisplay()` no decide nada, solo **refleja** el estado. Se llama después de cada cambio.

---

### Part 3 — Handlers (los que manejan los clicks)

#### `inputNumber(num)` — cuando presionas un número o el punto

```js
function inputNumber(num) {
  if (shouldResetScreen) {
    currentValue = num;          // reemplaza la pantalla
    shouldResetScreen = false;
  } else if (num === '.' && currentValue.includes('.')) {
    return;                       // ya hay un punto, no agregues otro
  } else if (currentValue === '0' && num !== '.') {
    currentValue = num;          // reemplaza el "0" inicial
  } else {
    currentValue += num;         // concatenación normal
  }
  updateDisplay();
}
```

Casos que maneja:
| Situación | Qué pasa |
|-----------|----------|
| `shouldResetScreen = true` | Reemplaza todo (ej: después de `+`, escribo `5` → pantalla se limpia y muestra `5`) |
| Ya hay un punto y escribo otro | No hace nada (un número solo puede tener un punto) |
| Pantalla dice `0` y escribo `5` | Reemplaza el `0` → muestra `5` (no `05`) |
| Pantalla dice `12` y escribo `3` | Concatena → `123` |

#### `inputOperator(op)` — cuando presionas +, −, ×, ÷

```js
function inputOperator(op) {
  if (operator !== null && !shouldResetScreen) {
    calculate();  // si ya había operación pendiente, la resuelve primero
  }
  previousValue = currentValue;
  operator = op;
  shouldResetScreen = true;
  updateDisplay();
}
```

**¿Por qué calcula antes de guardar el nuevo operador?** Para permitir **encadenamiento**: escribo `5 + 3 − 2`. Cuando presiono `−`, JS calcula `5 + 3 = 8` primero, guarda `8` como `previousValue`, y el nuevo operador es `−`. Luego al presionar `=` da `8 − 2 = 6`.

#### `calculate()` — cuando presionas =

1. Toma `previousValue` y `currentValue`, los convierte a número con `parseFloat()`.
2. Según el operador, hace la cuenta (`switch`).
3. Guarda el resultado en `currentValue`.
4. Limpia `operator` y `previousValue`.
5. Pone `shouldResetScreen = true` para el próximo número.

**División por cero**: si detecta `curr === 0`, muestra `"Error"` en vez de hacer la cuenta.

#### `roundResult(num)` — redondeo

```js
function roundResult(num) {
  return Math.round(num * 100000000) / 100000000 + '';
}
```

JavaScript tiene problemas de precisión con decimales (`0.1 + 0.2 = 0.30000000000000004`). Esto redondea a máximo 8 decimales. El `+ ''` al final convierte el número a string otra vez.

#### `clear()` — AC (All Clear)

Pone todas las variables a su valor inicial:
- `currentValue = '0'`
- `previousValue = ''`
- `operator = null`
- `shouldResetScreen = false`
- Llama a `updateDisplay()`

#### `deleteDigit()` — DEL (borra un dígito)

| Caso | Qué hace |
|------|----------|
| La pantalla se iba a reiniciar | Muestra `0` y cancela el reinicio |
| `currentValue` tiene más de 1 dígito | Quita el último (`slice(0, -1)`) |
| `currentValue` tiene 1 dígito | Vuelve a `0` |

---

### Part 4 — Event Listeners (conectar botones con handlers)

```js
document.querySelectorAll('.number').forEach(button => {
  button.addEventListener('click', () => inputNumber(button.textContent));
});
```

| Código | Qué significa |
|--------|---------------|
| `document.querySelectorAll('.number')` | Busca TODOS los botones con clase `number` |
| `.forEach(button => {...})` | Itera sobre cada uno |
| `addEventListener('click', ...)` | "Cuando ocurra un click, ejecuta esto" |
| `() => inputNumber(button.textContent)` | Llama a `inputNumber` con el texto del botón (`'7'`, `'8'`, etc.) |

| Botón | Event Listener |
|-------|----------------|
| `.number` (0-9) | `inputNumber(button.textContent)` |
| `.decimal` (.) | `inputNumber('.')` |
| `.operator` (+ − × ÷) | `inputOperator(button.textContent)` |
| `.equals` (=) | `calculate` |
| `.clear` (AC) | `clear` |
| `.delete` (DEL) | `deleteDigit` |

### Bonus — Keyboard support (teclado físico)

```js
document.addEventListener('keydown', (event) => { ... });
```

Escucha todo el teclado. Traduce teclas a llamadas de nuestras funciones:

| Tecla | Acción |
|-------|--------|
| `0`-`9` | `inputNumber(tecla)` |
| `.` | Punto decimal |
| `+` | Suma |
| `-` | Resta |
| `*` | Multiplicación |
| `/` | División (con `preventDefault()` para que no abra la búsqueda) |
| `Enter` o `=` | Calcular |
| `Backspace` | Borrar dígito |
| `Escape` | Limpiar todo (AC) |

---

### El ciclo completo

```
Click en "7"
   ↓
addEventListener detecta el evento 'click'
   ↓
Llama a inputNumber("7") ← HANDLER
   ↓
Modifica currentValue ← STATE
   ↓
Llama a updateDisplay() ← RENDER
   ↓
El número "7" aparece en pantalla
```

Cada botón sigue este mismo ciclo. **State → Handler → Render**.

---

### Operadores y conceptos nuevos de JS

| Concepto | Explicación |
|----------|-------------|
| `function` | Bloque de código reutilizable. Se define una vez, se llama muchas veces. |
| `parseFloat()` | Convierte un string `'10.5'` a número `10.5`. |
| `switch` | Como varios `if` juntos. Revisa el valor de `operator` y ejecuta el caso que coincida. |
| `.includes()` | Pregunta si un string contiene algo: `'10.5'.includes('.')` → `true`. |
| `.slice(0, -1)` | Corta un string: `'123'.slice(0, -1)` → `'12'`. |
| `.querySelector()` | Busca el **primer** elemento que coincida con el selector CSS. |
| `.querySelectorAll()` | Busca **todos** los elementos que coincidan. Devuelve una lista. |
| `.forEach()` | Itera sobre cada elemento de una lista. |
| `addEventListener` | Le dice al navegador: "cuando pase X evento, ejecuta Y función". |
| `=>` (arrow function) | Forma corta de escribir funciones: `() => {...}`. |
| `event.preventDefault()` | Evita el comportamiento default del navegador (ej: que `/` abra la búsqueda). |
| `switch` | Como un `if` múltiple. Compara una variable contra varios valores posibles. |

---

*Updated as I build more features.*
