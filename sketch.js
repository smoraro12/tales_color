Quadrille.cellLength = 60;
let cols = 8;
let rows = 8;
let game;     // Pantalla principal
let red_c;      // cuadrilla piezas rojas
let blue_c;     // cuadrilla piezas azules
let green_c;   // cuadrilla piezas amarillas
let colors = []; // arreglo con los colres de las piezas
let global_game; // cuadrille con la unión de todas las piezas y el tablero principal
let changed; // cuadrille temporal para verificar movimientos
let game_patron;
let red_patron;
let green_patron;
let blue_patron;
let win_patron = [];
let waiting = false
let attempts = 5;
let currentLevel = 1;
let perfect_attempts = 0;
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
}

function setup() {
  //game_patron = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  //red_patron = [color(255, 0, 0), null, null, color(255, 0, 0), null, color(255, 0, 0), null, null, null, color(255, 0, 0), null, null, null, null, null, null];
  //green_patron = [null, null, null, null, null, null, null, color(0, 255, 0), null, null, null, color(0, 255, 0), color(0, 255, 0), color(0, 255, 0), null, null];
  //blue_patron = [null, color(0, 0, 255), color(0, 0, 255), null, color(0, 0, 255), null, null, null, color(0, 0, 255), null, null, null, null, null, null, null];
  createCanvas(cols * Quadrille.cellLength + 100, rows * Quadrille.cellLength + 100);
  // game = createQuadrille(4, game_patron); // tablero principal con obstáculos
  //red_c = createQuadrille(4, red_patron);   // cuadrilla piezas rojas
  //colors.push(red_c);
  //green_c = createQuadrille(4, green_patron); // cuadrilla piezas verdes
  //colors.push(green_c);
  //blue_c = createQuadrille(4, blue_patron); // cuadrilla piezas azules
  //colors.push(blue_c);
  loadLevel(currentLevel);
  updateGame(); // cuadrille con la unión de todas las piezas y el tablero principal

  // Generación de patrones para cada pieza
  const horizontal_patron = createQuadrille([color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);
  const t_patron = createQuadrille(2, [color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), null]);
  const l_patron = createQuadrille(2, [color(255, 0, 0), null, color(255, 0, 0), null, color(255, 0, 0), color(255, 0, 0)]);
  const s_patron = createQuadrille(2, [null, color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), null]);
  const square_patron = createQuadrille(2, [color(255, 0, 0), color(255, 0, 0), color(255, 0, 0), color(255, 0, 0)]);

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
    background(0);
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

  drawQuadrille(game, { outlineWeight: 0.5 });
  for (let c of colors) {
    drawQuadrille(c, { outlineWeight: 0.5 });
  }
  push();
  fill("yellow");
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(`Remaining attempts: ${attempts}`, 20, 8 * Quadrille.cellLength);
  pop();

}


function keyPressed() {
  key === 'ArrowLeft' && moveLeft(); // Se mueven piezas a la izquierda dentro del quadrille
  key === 'ArrowRight' && moveRight();  // Se mueven piezas a la derecha dentro del quadrille
  key === 'ArrowUp' && moveUp();    // Se mueven piezas hacia arriba dentro del quadrille
  key === 'ArrowDown' && moveDown();   // se mueven piezas hacia abajo dentro del quadrille
  return false;
}

function mouseClicked() {
    if (gameState === "menu" && btnPlay) {
        btnPlay.handleClick();
    }
}

function moveUp() {
  if (waiting || attempts <= 0) return;
  updateGame();
  for (let row = 0; row < game.height; row++) {
    for (let col = 0; col < game.width; col++) {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i].read(row, col) !== null) {
          if (row - 1 >= 0 && global_game.read(row - 1, col) == null) {
            colors[i].fill(row - 1, col, colors[i].read(row, col));
            colors[i].fill(row, col, null);
            changed = true;
            updateGame();
          }
        }
      }
    }
  }
  checkPatron();
}
function moveDown() {
  if (waiting || attempts <= 0) return;
  updateGame();
  for (let row = game.height - 1; row >= 0; row--) {
    for (let col = 0; col < game.width; col++) {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i].read(row, col) !== null) {
          if (row + 1 < game.height && global_game.read(row + 1, col) == null) {
            colors[i].fill(row + 1, col, colors[i].read(row, col));
            colors[i].fill(row, col, null);
            changed = true;
            updateGame();
          }
        }
      }
    }
  }
  checkPatron();
}

function moveLeft() {
  if (waiting || attempts <= 0) return;
  updateGame();
  for (let col = 0; col < game.width; col++) {
    for (let row = 0; row < game.height; row++) {
      for (let i = 0; i < colors.length; i++) {
        if (colors[i].read(row, col) !== null) {
          if (col - 1 >= 0 && global_game.read(row, col - 1) == null) {
            colors[i].fill(row, col - 1, colors[i].read(row, col));
            colors[i].fill(row, col, null);
            changed = true;
            updateGame();
          }
        }
      }
    }
  }
  checkPatron();
}

function moveRight() {
  if (waiting || attempts <= 0) return;
  updateGame();
  for (let col = game.width - 1; col >= 0; col--) {
    for (let row = 0; row < game.height; row++) {
      for (let i = 0; i < colors.length; i++) {

        if (colors[i].read(row, col) !== null) {
          if (col + 1 < game.width && global_game.read(row, col + 1) == null) {
            colors[i].fill(row, col + 1, colors[i].read(row, col));
            colors[i].fill(row, col, null);
            changed = true;
            updateGame();
          }
        }
      }
    }
  }
  checkPatron();
}

function checkPatron() {
  waiting = true;
  for (let i = 0; i < colors.length; i++) {
    for (let p of win_patron) {
      if (colors[i].search(p, false).length > 0) {
        setTimeout(() => { colors[i].clear(); waiting = false; attempts++ }, 400)
      }
    }
  }
  if (waiting == true && changed == true) {
    setTimeout(() => { attempts--, changed = false; }, 200)
  }
  waiting = false;
  updateGame();
}


function updateGame() {
  global_game = game;
  for (let i = 0; i < colors.length; i++) {
    global_game = Quadrille.or(global_game, colors[i]);
  }
}

function loadLevel(CurrentLevel) {
  fetch("levels.json")
    .then(r => r.json())
    .then(data => {

      let level = data.levels[CurrentLevel - 1];

      cols = level.mapSize.cols;
      rows = level.mapSize.rows;

      game = createQuadrille(
        rows,
        level.boardPattern
      );

      colors = [];

      for (let c of level.colors) {

        let realColor;

        switch (c.name) {
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

        // Reemplazar letras por colores reales
        let pattern = c.pattern.map(cell => {
          return cell ? realColor : null;
        });

        colors.push(
          createQuadrille(rows, pattern)
        );
      }

      perfect_attempts = level.perfectMoves;

      updateGame();
    });
}