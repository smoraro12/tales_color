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
}

function draw() {
  background(0);
  if (!game) return;

  drawQuadrille(game, { outlineWeight: 0.5 });
  for (let c of colors) {
    drawQuadrille(c, { outlineWeight: 0.5 });
  }
  fill("yellow");
  textSize(16);
  text(`Remaining attempts: ${attempts}`, 20, 8 * Quadrille.cellLength);

}


function keyPressed() {
  key === 'ArrowLeft' && moveLeft(); // Se mueven piezas a la izquierda dentro del quadrille
  key === 'ArrowRight' && moveRight();  // Se mueven piezas a la derecha dentro del quadrille
  key === 'ArrowUp' && moveUp();    // Se mueven piezas hacia arriba dentro del quadrille
  key === 'ArrowDown' && moveDown();   // se mueven piezas hacia abajo dentro del quadrille
  return false;
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