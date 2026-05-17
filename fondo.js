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