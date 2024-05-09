'Use Strict';

// Constructores
function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

function Interfaz() {
  //Constructor vacío
}

// Prototipos
Seguro.prototype.cotizarSeguro = function () {
  /*
  Sobre precio base:
  1 = Americano Costo mediano, 1.15
  2 = Asiático Costo bajo, 1.05
  3 = Europeo Costo alto, 1.35

  Reducción del 3% por cada año de antigüedad del vehículo

  Cobertura básica aumenta 30%
  Cobertura completa aumenta 50%
  */

  let cantidad;
  const base = 2000;

  // Precio base
  switch (this.marca) {
    case '1':
      cantidad = base * 1.15;
      break;
    case '2':
      cantidad = base * 1.05;
      break;
    case '3':
      cantidad = base * 1.35;
      break;
    default:
      break;
  };

  // Descuento por antigüedad
  cantidad -= ((new Date().getFullYear() - this.year) * 3) * cantidad / 100;

  // Cobertura
  if (this.tipo === 'basico') {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

Interfaz.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20;
  const selectYear = document.querySelector('#year');

  for (let i = max; i > min; i--) {
    let option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
}

Interfaz.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement('DIV');

  if (tipo === 'error') {
    div.classList.add('error');
  } else {
    div.classList.add('correcto');
  }

  div.classList.add('mensaje', 'mt-10');
  div.textContent = mensaje;

  const formulario = document.querySelector('#cotizar-seguro');
  formulario.insertBefore(div, document.querySelector('#resultado'));

  setTimeout(() => {
    div.remove();
  }, 3000);
}

Interfaz.prototype.mostrarResultado = (seguro, total) => {
  const { marca, year, tipo } = seguro;

  let tipoTexto;
  let marcaTexto;

  switch (tipo) {
    case 'basic':
      tipoTexto = 'Básico';
      break;
    case 'completo':
      tipoTexto = 'Completo';
      break;
    default:
      break;
  };

  switch (marca) {
    case '1':
      marcaTexto = 'Americano';
      break;
    case '2':
      marcaTexto = 'Asiático';
      break;
    case '3':
      marcaTexto = 'Europeo';
      break;
    default:
      break;
  };

  const div = document.createElement('DIV');
  div.classList.add('mt-10');

  div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Marca: <span class="font-normal">${marcaTexto}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal">${tipoTexto}</span></p>
    <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
  `;

  const resultadoDiv = document.querySelector('#resultado');

  // Spinner simulando comunicación a BD
  const spinner = document.querySelector('#cargando');
  spinner.style.display = 'block';

  setTimeout(() => {
    spinner.style.display = 'none';
    resultadoDiv.appendChild(div);
  }, 3000);
}

// Instancias
const interfaz = new Interfaz();

// Listeners
document.addEventListener('DOMContentLoaded', () => {
  interfaz.llenarOpciones();
});

eventListeners();
function eventListeners() {
  const formulario = document.querySelector('#cotizar-seguro');
  formulario.addEventListener('submit', cotizarSeguro);
}

// Funciones
function cotizarSeguro(e) {
  e.preventDefault();
  const marca = document.querySelector('#marca').value;
  const year = document.querySelector('#year').value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === '' || year === '' || tipo === '') {
    interfaz.mostrarMensaje('Todos los campos son obligatorios', 'error');
    return;
  }

  interfaz.mostrarMensaje('Cotizando...', 'exito');

  // Eliminar cotización anterior
  const resultados = document.querySelector('#resultado div');

  if (resultados!== null) {
    resultados.remove();
  }

  // Instancia de seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  // Comunicar cotización a la interfaz
  interfaz.mostrarResultado(seguro, total);
}
