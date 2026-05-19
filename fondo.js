let backgroundHome;
let fondoGame;

function preload () {
  backgroundHome = loadImage("assets/homeImage.jpg"); 
  fondoGame = loadImage("assets/fondoGame.jpg");
}
function drawBackground() {
  if (gameState === "home") {
    push();
    drawingContext.filter= "blur(4px)";
    image(backgroundHome, 0, 0, width, height);
    pop();
  } else if (gameState === "game") {
    push();
    drawingContext.filter= "blur(2px)";
    image(fondoGame, 0, 0, width, height);
    pop();
  }
} 
//Funcion para creacion de fondo en el juego, dependiendo del estado del juego se muestra un fondo u otro. En el estado "home" se muestra una imagen de fondo con un filtro de desenfoque de 4px, mientras que en el estado "game" se muestra otra imagen de fondo con un filtro de desenfoque de 2px.