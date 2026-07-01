/* ==========================================
   PARTE 1 — STATE (el estado de la calculadora)
   ========================================== */

// Número que se está escribiendo AHORA en la pantalla grande
let currentValue = '0';

// Número que se escribió ANTES de presionar un operador
let previousValue = '';

// Qué operación se va a hacer (null = ninguna aún)
let operator = null;

// ¿La pantalla debe reiniciarse cuando escriba el próximo número?
// Pasa a true después de presionar un operador o el igual
let shouldResetScreen = false;

/* ==========================================
   PARTE 2 — RENDER (pintar el estado en pantalla)
   ========================================== */

// Toma las variables y las muestra en el HTML
function updateDisplay() {
  // Pantalla grande: el número actual
  document.querySelector('.current-operand').textContent = currentValue;

  // Pantalla chica: el número anterior + el operador
  // Si hay operador, muestra ej: "10 +", si no, muestra vacío
  document.querySelector('.previous-operand').textContent =
    previousValue + (operator || '');
}

/* ==========================================
   PARTE 3 — HANDLERS (funciones que manejan los clicks)
   ========================================== */

// --- NÚMEROS Y PUNTO DECIMAL ---
function inputNumber(num) {
  // Si la pantalla debe reiniciarse, reemplaza todo
  if (shouldResetScreen) {
    currentValue = num;
    shouldResetScreen = false;
  } else if (num === '.' && currentValue.includes('.')) {
    // Si ya hay un punto, no agregues otro
    return;
  } else if (num === '.' && currentValue === '') {
    // Si está vacío y ponen punto, muestra "0."
    currentValue = '0.';
    return;
  } else if (currentValue === '0' && num !== '.') {
    // Si es "0" y escriben otro número, reemplaza el 0
    currentValue = num;
  } else {
    // Caso normal: agrega el dígito al final
    currentValue += num;
  }

  updateDisplay();
}

// --- OPERADORES (+, −, ×, ÷) ---
function inputOperator(op) {
  // Si ya había un operador y hay un número nuevo, calcula primero
  // (esto permite encadenar: 5 + 3 − 2 = ...)
  if (operator !== null && !shouldResetScreen) {
    calculate();
  }

  // Guarda el número actual como "anterior"
  previousValue = currentValue;
  // Guarda el operador que se presionó
  operator = op;
  // La próxima vez que escriban un número, que reinicie la pantalla
  shouldResetScreen = true;

  updateDisplay();
}

// --- IGUAL (=) ---
function calculate() {
  if (operator === null || shouldResetScreen) {
    // Si no hay operador o ya se calculó, no hace nada
    return;
  }

  // Convierte los strings a números para la operación
  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  let result;

  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '−':
      result = prev - curr;
      break;
    case '×':
      result = prev * curr;
      break;
    case '÷':
      if (curr === 0) {
        // No se puede dividir por cero
        currentValue = 'Error';
        operator = null;
        previousValue = '';
        shouldResetScreen = true;
        updateDisplay();
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  // Redondea para evitar decimales muy largos (ej: 0.1 + 0.2)
  currentValue = roundResult(result);
  operator = null;
  previousValue = '';
  shouldResetScreen = true;

  updateDisplay();
}

// Redondea a máximo 8 decimales para evitar errores de precisión
function roundResult(num) {
  return Math.round(num * 100000000) / 100000000 + '';
}

// --- CLEAR (AC) — reinicia todo ---
function clear() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

// --- DELETE (DEL) — borra el último dígito ---
function deleteDigit() {
  if (shouldResetScreen) {
    // Si la pantalla se iba a reiniciar, solo muestra "0"
    currentValue = '0';
    shouldResetScreen = false;
    updateDisplay();
    return;
  }

  // Si tiene más de 1 carácter, quita el último
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    // Si solo queda 1 dígito, vuelve a "0"
    currentValue = '0';
  }

  updateDisplay();
}

/* ==========================================
   PARTE 4 — EVENT LISTENERS (conectar botones con handlers)
   ========================================== */

// --- BOTONES NÚMERO ---
document.querySelectorAll('.number').forEach(button => {
  button.addEventListener('click', () => inputNumber(button.textContent));
});

// --- BOTÓN DECIMAL ---
document.querySelector('.decimal').addEventListener('click', () => inputNumber('.'));

// --- BOTONES OPERADOR ---
document.querySelectorAll('.operator').forEach(button => {
  button.addEventListener('click', () => inputOperator(button.textContent));
});

// --- BOTÓN IGUAL ---
document.querySelector('.equals').addEventListener('click', calculate);

// --- BOTÓN CLEAR (AC) ---
document.querySelector('.clear').addEventListener('click', clear);

// --- BOTÓN DELETE (DEL) ---
document.querySelector('.delete').addEventListener('click', deleteDigit);

// --- TECLADO DEL TECLADO FÍSICO (opcional) ---
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Números del teclado (0-9)
  if (key >= '0' && key <= '9') {
    inputNumber(key);
  }

  // Punto decimal
  if (key === '.') {
    inputNumber('.');
  }

  // Operadores
  if (key === '+') inputOperator('+');
  if (key === '-') inputOperator('−');
  if (key === '*') inputOperator('×');
  if (key === '/') {
    event.preventDefault(); // evita que el navegador abra la búsqueda
    inputOperator('÷');
  }

  // Enter o = para calcular
  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  }

  // Backspace para borrar
  if (key === 'Backspace') {
    deleteDigit();
  }

  // Escape para limpiar todo
  if (key === 'Escape') {
    clear();
  }
});
