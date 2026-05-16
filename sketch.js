Quadrille.cellLength = 60; //Define tamaño de celda 
let cols = 8; // Inicialización de variables que definen el número de columnas y filas del tablero
let rows = 8;
let game;     // Quadrille de juego vacio que puede contener obstaculos
let colors = []; // arreglo que contedrá los quadrilles para cada pieza de color
let global_game; // Quadrille para identificar colisiones entre piezas y el tablero
let changed; // Variable que determina si un movimiento resultó en un cambio en el tablero
let win_patron = []; // Arreglo que contiene los patrones de victoria
let waiting = false // Variable que restringe movimientos adicionales si se están efectuando animaciones o verificaciones
let attempts = 5; // Cantidad inicial de intentos que varia con aciertos, errores y niveles completados
let currentLevel = 1; // Nivel actual del juego
let perfectAttempts = 0; // Número de movimientos minimos para completar el nivel, definido en levels.json
let attemptsLevel = 0; // Contador de movimientos realizados en el nivel actual usado para determinar si se hizo la cantidad minima de movimientos
let timeline = []; // Arreglo que almacena los estados del tablero para permitir deshacer movimientos
let totalLevels = 0;

function setup() {
  createCanvas(cols * Quadrille.cellLength + 100, rows * Quadrille.cellLength + 100); // Cambas creado basado en tamaño de tablero
  loadLevel(currentLevel); // Carga el nivel inicial definido en levels.json
  updateGame(); // Actualización del quadrille global para verificar colisiones y movimientos

  // Generación de patrones para cada pieza
  const horizontal_patron = createQuadrille([color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);
  const t_patron = createQuadrille(2, [color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), null]);
  const l_patron = createQuadrille(2, [color(255, 0, 0), null, color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0)]);
  const s_patron = createQuadrille(2, [null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), null]);
  const square_patron = createQuadrille(2, [color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);
  // Agregación de patrones al arreglo de patrones de victoria, incluyendo sus transformaciones (rotaciones y reflexiones)
  win_patron.push(horizontal_patron,
    horizontal_patron.clone().transpose(),
    t_patron,
    t_patron.clone().reflect(),
    t_patron.clone().transpose(),
    t_patron.clone().transpose().reflect(),
    l_patron,
    l_patron.clone().reflect(),
    l_patron.clone().rotate(180),
    l_patron.clone().rotate(180).reflect(),
    l_patron.clone().transpose(),
    l_patron.clone().transpose().reflect(),
    l_patron.clone().transpose().rotate(180),
    l_patron.clone().transpose().rotate(180).reflect(),
    s_patron,
    s_patron.clone().reflect(),
    s_patron.clone().transpose(),
    s_patron.clone().transpose().reflect(),
    s_patron.clone().rotate(180),
    square_patron,
  );
}

function draw() {
  background(0); // definición de color de fondo

  drawQuadrille(game, { outlineWeight: 0.5 }); // dibujo de quadrille de juego
  for (let c of colors) { // Dibujo de cada quadrille que contiene piezas de color
    drawQuadrille(c, { outlineWeight: 0.5 });
  }
  fill("yellow"); // Definición color de texto
  textSize(16); // Definición tamaño de texto
  text(`Remaining attempts: ${attempts}`, 20, 8 * Quadrille.cellLength); // Dibujo de texto que muestra intentos restantes
}

// Definición de función para manejar eventos de teclado
function keyPressed() {
  key === 'ArrowLeft' && moveLeft(); // Se mueven piezas a la izquierda dentro del quadrille
  key === 'ArrowRight' && moveRight();  // Se mueven piezas a la derecha dentro del quadrille
  key === 'ArrowUp' && moveUp();    // Se mueven piezas hacia arriba dentro del quadrille
  key === 'ArrowDown' && moveDown();   // se mueven piezas hacia abajo dentro del quadrille
  key === 't' && undoMovement(); // Deshacer movimiento
  return false;
}
// Definición de funciones para mover piezas en cada dirección
function moveUp() {
  if (waiting || attempts <= 0) return; // Si se esta haciendo un movimiento o no hay intentos restantes, no se genera un nuevo movimiento
  updateGame(); // Actualización del quadrille global para verificar colisiones y movimientos
  const previousState = captureState(); // Captura del estado actual del juego para permitir deshacer movimientos
  changed = false; // Reinicio de variable que determina si un movimiento resultó en un cambio en el tablero

  for (let row = 0; row < game.height; row++) { // Iteración sobre filas del tablero de arriba hacia abajo
    for (let col = 0; col < game.width; col++) { // Iteración sobre columnas del tablero de izquierda a derecha
      for (let i = 0; i < colors.length; i++) { // Iteración sobre cada quadrille de color
        if (colors[i].read(row, col) !== null) { // Lectura de celda para verificar si hay una pieza de color en la posición actual
          if (row - 1 >= 0 && global_game.read(row - 1, col) == null) { // Si hay una pieza de color en la posición actual, se verifica que hay en la posición inmediatamente arriba
            colors[i].fill(row - 1, col, colors[i].read(row, col)); // Si no hay nada en la posición inmediatamente arriba, se mueve la pieza de color a esa posición
            colors[i].fill(row, col, null); // y la posición actual se deja vacía
            changed = true; // Como hubo una pieza de color que se movió, se marca que hubo un cambio en el tablero
            updateGame(); // Actualización del quadrille global para reflejar el movimiento realizado
          }
        }
      }
    }
  }

  if (!changed) return; // Si no hubo ningún movimiento que resultara en un cambio en el tablero, no se hace nada más
  timeline.push(previousState);  // Se almacena el moviiento realizado en el timeline para permitir deshacerlo 
  attempts--; // Se reduce la cantidad de intentos restantes como resultado de un movimiento realizado
  attemptsLevel++; // Se incrementa el contador de movimientos realizados en el nivel actual
  checkPatron(); // Se verifica si con el movimiento realizado se formó un patrón de victoria o si se completó el nivel
}

function moveDown() {
  if (waiting || attempts <= 0) return;
  updateGame();
  const previousState = captureState();
  changed = false;

  for (let row = game.height - 1; row >= 0; row--) { // Iteración sobre filas del tablero de abajo hacia arriba
    for (let col = 0; col < game.width; col++) {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i].read(row, col) !== null) {
          if (row + 1 < game.height && global_game.read(row + 1, col) == null) { // Notese que la posición leída siempre debe estar dentro de los limites del quadrille para no leer valores mas grandes que el tamaño de quadrille
            colors[i].fill(row + 1, col, colors[i].read(row, col));
            colors[i].fill(row, col, null);
            changed = true;
            updateGame();
          }
        }
      }
    }
  }

  if (!changed) return;
  timeline.push(previousState);
  attempts--;
  attemptsLevel++;
  checkPatron();
}

function moveLeft() {
  if (waiting || attempts <= 0) return;
  updateGame();
  const previousState = captureState();
  changed = false;

  for (let col = 0; col < game.width; col++) { // Iteración sobre columnas del tablero de izquierda a derecha
    for (let row = 0; row < game.height; row++) {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i].read(row, col) !== null) { // Lectura de celda para verificar si hay una pieza de color en la posición actual
          if (col - 1 >= 0 && global_game.read(row, col - 1) == null) { // Si hay una pieza de color en la posición actual, se verifica que hay en la posición inmediatamente a la izquierda
            colors[i].fill(row, col - 1, colors[i].read(row, col)); // Si no hay nada en la posición inmediatamente a la izquierda, se mueve la pieza de color a esa posición
            colors[i].fill(row, col, null); // y la posición actual se deja vacía
            changed = true; // Como hubo una pieza de color que se movió, se marca que hubo un cambio en el tablero
            updateGame(); // Actualización del quadrille global para reflejar el movimiento realizado
          }
        }
      }
    }
  }

  if (!changed) return;
  timeline.push(previousState);
  attempts--;
  attemptsLevel++;
  checkPatron();
}

function moveRight() {
  if (waiting || attempts <= 0) return;
  updateGame();
  const previousState = captureState();
  changed = false;

  for (let col = game.width - 1; col >= 0; col--) { // Iteración sobre columnas del tablero de derecha a izquierda
    for (let row = 0; row < game.height; row++) {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i].read(row, col) !== null) {
          if (col + 1 < game.width && global_game.read(row, col + 1) == null) { // Notese que la posición leída siempre debe estar dentro de los limites del quadrille para no leer valores mas grandes que el tamaño de quadrille
            colors[i].fill(row, col + 1, colors[i].read(row, col));
            colors[i].fill(row, col, null);
            changed = true;
            updateGame();
          }
        }
      }
    }
  }

  if (!changed) return;
  timeline.push(previousState);
  attempts--;
  attemptsLevel++;
  checkPatron();
}

function checkPatron() {
  let foundMatch = false; // Variable para determinar si se encontró un patrón de victoria después de un movimiento realizado

  for (let i = 0; i < colors.length; i++) { // Iteración sobre el arreglo que contiene los quadrilles de color
    for (let p of win_patron) {
      if (colors[i].search(p, false).length > 0) { //Se revisa si hay una coincidencia de victoria en cada quadrille de color
        foundMatch = true; // Si la hay, se marca que se encontró un patrón de victoria
        setTimeout(() => { // Se espera un momento para limpiar el quadrille de color para el que se formó el patrón
          colors[i].clear(); // Se limpia el quadrille
          attempts++; // Una coincidencia de victoria otorga un intento adicional
        }, 400);
      }
    }
  }

  if (foundMatch) { // Si hubo una coincidencia
    waiting = true; // Se restringen movimientos adicionales
    setTimeout(() => { // Se espera un momento, se reinician las variables de control de cambio, 
      waiting = false;
      changed = false;
      updateGame(); // se actualiza el juego 
      checkLevelComplete(); // y se verifica si se completó el nivel
    }, 400);
  } else if (changed) { // Si no hubo coincidencia pero si cambio en el tablero
    waiting = true; // se restringen movimientos adicionales
    setTimeout(() => { // Se espera un momento, se reinician las variables de control de cambio,
      changed = false;
      waiting = false;
      updateGame(); // se actualiza el juego para reflejar el movimiento realizado
    }, 400);
  } else { // Si no hubo coincidencia ni cambio igual se actualiza el tablero
    updateGame();
  }
}

function isLevelComplete() { // Función para verificar si se completó el nivel
  return colors.every(c => c.order === 0); // El nivel está completo si todos los quadrilles de color tienen orden 0 puesto que no tienen elementos
}

function checkLevelComplete() { // Función para transicionar al siguiente nivel si se completó el actual
  if (!isLevelComplete()) return; // Siempre que un nivel no ha sido completado, no se hace nada

  if (currentLevel < totalLevels) { // Se verifica si el nivel actual es menor a la cantidad de niveles
    if (attemptsLevel <= perfectAttempts) { // Si el nivel se completó con la cantidad de movimientos mínimos, 
      attempts++; // se otorga un intento adicional
    }
    currentLevel++; // Se incrementa el contador de nivel actual para cargar el siguiente nivel
    attemptsLevel = 0; // Se reinician variables
    timeline = [];
    waiting = false;
    changed = false;
    loadLevel(currentLevel); // Se carga el siguiente nivel
  } else { // referencia que sirve para mostrar que no hay mas niveles en caso de que se complete el último nivel definido en levels.json
    console.log("Juego completado. No hay más niveles.");
  }
}

function updateGame() { // Función que actualiza el quadrille global para verificar colisiones y movimientos
  global_game = game; // Se parte del quadrille de juego que contiene los obstáculos
  for (let i = 0; i < colors.length; i++) { // Iteración sobre el arreglo de quadrilles de color
    global_game = Quadrille.or(global_game, colors[i]); // Se hace una operación OR entre el quadrille global y cada quadrille de color para reflejar la posición de las piezas de color en el quadrille global
  }
}

function loadLevel(CurrentLevel) { // Función para cargar niveles definidos en levels.json
  fetch("levels.json") // Carga de datos de archivo JSON que contiene la definición de niveles, incluyendo el tamaño del tablero, la posición de obstáculos, las piezas de color y la cantidad de movimientos mínimos para completar el nivel
    .then(r => r.json())
    .then(data => { // Se obtiene la información del nivel a cargar a partir del número de nivel actual

      let level = data.levels[CurrentLevel - 1];

      cols = level.mapSize.cols; // Lectura de columnas y filas para definir el tamaño del tablero a partir de la información del nivel cargado
      rows = level.mapSize.rows;

      game = createQuadrille(
        rows,
        level.boardPattern
      ); // Creación del quadrille de juego a partir del patrón definido en el nivel cargado, el cual incluye la posición de los obstáculos

      colors = []; // Reinicio del arreglo de quadrilles de color para cargar las piezas de color definidas en el nivel cargado

      totalLevels = data.levels.length; // Lectura de la cantidad total de niveles definidos en el archivo JSON para controlar la transición entre niveles y mostrar referencia de juego completado

      for (let c of level.colors) { // Iteración sobre los arreglos de piezas de color tomados del archivo JSON para un nivel dado

        let realColor; // Variable que almacena el color real a asignar basado en el nombre definido para cada arreglo de color

        switch (c.name) { // Se asigna un color basado en el nombre definido para cada arreglo de color
          case "red":
            realColor = color(255, 0, 0);
            break;

          case "green":
            realColor = color(0, 255, 0);
            break;

          case "blue":
            realColor = color(0, 0, 255);
            break;

          case "yellow":
            realColor = color(255, 255, 0);
            break;
        }

        let pattern = c.pattern.map(cell => { // Se genera un arreglo pattern con la posición de las piezas de color
          return cell ? realColor : null; // Si la celda tiene un valor, se reemplaza por el color real asignado, de lo contrario se deja como null para indicar que no hay pieza de color en esa posición
        });

        colors.push( // Al arreglo que almacena los quadrilles de color se le agrega un nuevo quadrille creado a partir del patrón generado para cada arreglo de color definido en el nivel cargado
          createQuadrille(rows, pattern)
        );
      }

      perfectAttempts = level.perfectMoves; // Se lee la cantidad de movimientos mínimos para completar el nivel a partir de la información del nivel cargado

      updateGame(); // Se actualiza el quadrille global para reflejar la posición de los obstáculos y las piezas de color del nivel cargado
    })
}

function captureState() { // Función para capturar el estado actual del juego
  return { // retorna una copia de cada elemento del arreglo de quadrilles de color que serán almacenados en el timeline
    colors: colors.map(c => c.clone())
  };
}

function undoMovement() { // Función para deshacer el movimiento realizado
  if (timeline.length === 0 || waiting || attempts == 0) return; // Si no hay movimientos restantes, estados previos o se está en espera, no se ejecuta nada

  const previousState = timeline.pop(); // Se define el estado previo como el último estado almacenado en el timeline
  colors = previousState.colors.map(c => c.clone()); // Se actualiza el arreglo de quadrilles de color con previousState
  attempts--; // Deshacer un movimiento cuesta un intento
  changed = false; // No hay cambio considerado al deshacer un movimiento 
  waiting = false; // No hay espera al deshacer un movimiento
  updateGame(); // Se actualiza el quadrille global para reflejar el estado del juego después de deshacer el movimiento
}

