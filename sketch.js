  Quadrille.cellLength = 60; //Define tamaño de celda 
  let cols = 8; // Inicialización de variables que definen el número de columnas y filas del tablero
  let rows = 8;
  let game;     // Pantalla principal
  let red_c;      // cuadrilla piezas rojas
  let blue_c;     // cuadrilla piezas azules
  let green_c;   // cuadrilla piezas amarillas
  let colors = []; // arreglo con los cologres de las piezas
  let global_game; // cuadrille con la unión de todas las piezas y el tablero principal
  let changed; // cuadrille temporal para verificar movimientos
  let game_patron;
  let red_patron;
  let green_patron;
  let blue_patron;
  let yellow_patron;
  let win_patron = [];
  let waiting = false
  let attempts = 5;
  let currentLevel = 1;
  let perfectAttempts = 0;
  let timeline = [];
  let attemptsLevel;
  let totalLevels = 0;
  let gameState = "menu"; // Menu, niveles, jugando, confirmar, ganar
  let btnPlay;

  class Button{
      constructor(x, y, w, h, label, onClick){
          this.x = x; // Posición del boton en x
          this.y = y; // Posicion del boton en y
          this.w = w; // ancho del boton
          this.h = h; // Alto del boton 
          this.label = label; // Texto del boton
          this.onClick = onClick; // Que hace el boton cuando se oprime

          this.baseColor = [70, 130, 180, 180]; // azul con transparencia
          this.hoverColor = [100, 160, 220, 220]; // más claro al pasar mouse
          this.textColor = [255, 255, 255];
          this.radius = 12;
      }

      show (){
        let isHover = this.isHover(mouseX, mouseY);
        
        //Si esta en el boton el mouse que sea gris
        if (isHover){
          fill(255, 100);
        } 
        // sino esta que este normal
        else{
          fill(200, 50);
        }
        stroke(0); // El contorno negro
        rect(this.x, this.y, this.w, this.h);

        // Texto
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(18);
        text(this.label, this.x + this.w/2, this.y + this.h/2);
      }

      // Detecta si el mouse esta encima del boton
      isHover(mx, my){
          return mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h; 
      }

      // Ejecuta la acción si da click en el boton
      handleClick(){
          if(this.isHover(mouseX, mouseY)){
              this.onClick();
          }
      }
  }

  function createButtons(){
      btnPlay = new Button(width/2 - 75, height/2, 150, 50, "Jugar", () => {
      gameState = "playing";
    });
      btnReset = new Button(0, 0, 120, 37, "Inicio", () => {
      gameState = "menu";
    });
  }

  function setup() {
    createCanvas(450, windowHeight); // Cambas creado basado en tamaño de tablero
    let canvas = document.querySelector("canvas");// Se selecciona el elemento canvas generado por p5.js para agregarlo a un contenedor específico en el HTML
    canvas.parentElement.id = "game-container"; // El canvas se agrega a un contenedor para facilitar su posicionamiento con CSS
    loadLevel(currentLevel); // Carga el nivel inicial definido en levels.json

    // Generación de patrones para cada pieza
    const horizontal_patron = createQuadrille([color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);
    const t_patron = createQuadrille(2, [color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), null]);
    const t_patron_up = createQuadrille(3, [null, color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);
    const l_patron = createQuadrille(2, [color(255, 0, 0), null, color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0)]);
    const s_patron = createQuadrille(2, [null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), null]);
    const square_patron = createQuadrille(2, [color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);
    // Agregación de patrones al arreglo de patrones de victoria, incluyendo sus transformaciones (rotaciones y reflexiones)
    win_patron.push(horizontal_patron,
      horizontal_patron.clone().transpose(),
      t_patron,
      t_patron_up,
      t_patron.clone().rotate(180),
      t_patron.clone().transpose(),
      t_patron.clone().transpose().rotate(180),
      t_patron.clone().reflect().transpose(),
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
    createButtons();
  }

  function draw() {
      drawBackground();
      switch(gameState){
          case "menu":
              drawMenu();
              break;
          case "playing":
              drawPlaying()
              break;
      }
  }

  function drawBackground(){
      clear();
  }

  function drawMenu(){
      push();
      textAlign(CENTER);
      fill(255, 255, 255);
      textSize(40);
      text("Tales colores", width/2, height/2 - 100);
      pop();
      btnPlay.show();
      
  }

  function drawPlaying(){
    if (!game) return;

    textAlign(CENTER);
    fill('#e2daf0');
    textSize(50);
    textStyle(BOLD);
    text("FICHAS DE", width/2, 80);
    text("COLORES", width/2, 140);

    let today = new Date().toLocaleDateString(); // Se obtiene la fecha actual en formato local para mostrarla en la pantalla de juego
    let dateX = width / 2;
    let dateY = 200;
    
    fill(49, 0, 166, 150); // blanco transparente
    noStroke();

    textSize(20);
    let paddingx = 20;
    let paddingy = 17;
    let textw = textWidth(today);
    
    rect(
      dateX - (textw/2 + paddingx/2),
      dateY - paddingy,
      textw + paddingx,
      35,30); // bordes redondeados
    
    fill(255); // texto en negro
    textAlign(CENTER, CENTER);
    text(today, dateX, dateY);

    let topSpace =100; // espacio reservado arriba del tablero para el título y la fecha, esto se hace para que el tablero no se superponga con estos elementos y se mantenga una presentación clara y organizada en la pantalla de juego

    // Calcula las margenes
    let gridWidth = cols * Quadrille.cellLength;
    let gridHeight = rows * Quadrille.cellLength;

    let offsetX = (width - gridWidth) / 2; // Cálculo del margen horizontal para centrar el tablero en la pantalla
    let offsetY = topSpace + (height - topSpace - gridHeight) / 2; // Cálculo del margen vertical para centrar el tablero en la pantalla considerando el espacio reservado para el título y la fecha


    //////////////////////////////////////////////
    drawQuadrille(game, { x: offsetX, y: offsetY, outlineWeight: 0.5 }); // dibujo de quadrille de juego

    for (let c of colors) { // Dibujo de cada quadrille que contiene piezas de color
      drawQuadrille(c, { x: offsetX, y: offsetY, outlineWeight: 0.5 });
    }

    // condicional para mostrar el mensaje de movimientos restantes en singular o plural dependiendo de la cantidad de intentos restantes
    let textX = width / 2;
    let textY = offsetY + gridHeight + 40;
    push();
    fill("#e2daf0");
    textSize(16);
    textAlign(LEFT, BOTTOM);
    if (attempts === 1) {
    text(`${attempts} movimiento restante`,textX-90, textY);
    }
    else {
    text(`${attempts} movimientos restantes`,textX-90, textY);
    }
    pop();
    btnReset.show();

    // 👉 posición del botón debajo de los intentos
    btnReset.x = width / 2 - btnReset.w / 2;
    btnReset.y = textY + 20;

    btnReset.show();
  }

  // Definición de función para manejar eventos de teclado
  function keyPressed() {
    if (gameState !== "playing") return false; //  PAra que no se mueve si esta en menu
    key === 'ArrowLeft' && moveLeft(); // Se mueven piezas a la izquierda dentro del quadrille
    key === 'a' && moveLeft(); // Se mueven piezas a la izquierda dentro del quadrille
    key === 'ArrowRight' && moveRight();  // Se mueven piezas a la derecha dentro del quadrille
    key === 'd' && moveRight();  // Se mueven piezas a la derecha dentro del quadrille
    key === 'ArrowUp' && moveUp();    // Se mueven piezas hacia arriba dentro del quadrille
    key === 'w' && moveUp();    // Se mueven piezas hacia arriba dentro del quadrille
    key === 'ArrowDown' && moveDown();   // se mueven piezas hacia abajo dentro del quadrille
    key === 's' && moveDown();   // se mueven piezas hacia abajo dentro del quadrille
    key === 't' && undoMovement(); // Deshacer movimiento
    return false;
  }

  function mouseClicked() {
      if (gameState === "menu" && btnPlay) {
        btnPlay.handleClick();
      }
      else if (gameState === "playing" && btnReset) {
        btnReset.handleClick();
      }
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