// colori iniziali del cielo (giorno)
let red = 135;
let green = 206;
let blue = 235;

// posizione verticale del sole (y)
let sun = 100;

// variabile per gestire la transizione cielo: giorno → tramonto → notte
let skyFade = 0;

// array per memorizzare stelle
let stars = [];

function setup() {
  createCanvas(1000, 400);
  noStroke();

  // genera stelle casuali
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: random(width), // posizione orizzontale
      y: random(height / 2),    // posizione verticale (solo metà superiore)
      size: random(1, 3),       // dimensione casuale
      brightness: random(150, 255) // luminosità casuale
    });
  }
}

function draw() {
  // transizione giorno → notte
  if (skyFade < 510) {
    skyFade += 0.5; // aumento graduale per il passaggio giorno→notte
  } else {
    // reset dopo la notte (riparte un nuovo giorno)
    skyFade = 0;
    sun = 100;
  }

  // mappa colori del cielo
  if (skyFade < 255) {
    // giorno → tramonto (cielo azzurro → arancio)
    red = map(skyFade, 0, 255, 135, 255);
    green = map(skyFade, 0, 255, 206, 80);
    blue = map(skyFade, 0, 255, 235, 100);
  } else {
    // tramonto → notte (cielo arancione → blu scuro)
    red = map(skyFade, 255, 510, 255, 20);
    green = map(skyFade, 255, 510, 80, 30);
    blue = map(skyFade, 255, 510, 100, 60);
  }

  background(red, green, blue); // aggiorna lo sfondo

  // movimento del sole
  if (sun < 420) sun += 0.5; // il sole scende lentamente

  // sole (solo finché non tramonta)
  if (sun < 400) {
    fill(255, 150, 0, 100); // colore esterno trasparente
    circle(500, sun, 180); // cerchio grande
    fill(255, 200, 0, 200); // colore intermedio
    circle(500, sun, 120);
    fill(255, 255, 150); // colore interno
    circle(500, sun, 80);
  }

  // luna (sale nella notte)
  if (skyFade > 350) { // appare dopo il tramonto
    let moonY = map(skyFade, 350, 510, 400, 120); // sale lentamente
    fill(255, 255, 230, map(skyFade, 350, 510, 0, 255)); // colore luna
    circle(800, moonY, 60);
    fill(20, 20, 50, map(skyFade, 350, 510, 0, 200)); // ombra falce
    circle(790, moonY - 5, 60);
  }

  // stelle
  if (skyFade > 320) {
    for (let s of stars) {
      fill(255, 255, 255, map(skyFade, 320, 510, 0, s.brightness));
      circle(s.x, s.y, s.size);
    }
  }

  // montagne
  fill(lerpColor(color(100, 60, 20), color(30, 20, 10), skyFade / 510));
  triangle(0, 400, 250, 220, 500, 400);
  fill(lerpColor(color(130, 80, 30), color(50, 30, 15), skyFade / 510));
  triangle(500, 400, 750, 220, 1000, 400);

  // terreno
  fill(lerpColor(color(60, 40, 20), color(20, 10, 5), skyFade / 510));
  rect(0, 380, width, 20);

  // nuvole (si dissolvono)
  let cloudAlpha = map(skyFade, 0, 300, 200, 0);
  drawCloud(200, 100, 50, cloudAlpha);
  drawCloud(750, 80, 40, cloudAlpha);
  drawCloud(600, 130, 60, cloudAlpha);
}

// funzione per disegnare nuvole
function drawCloud(x, y, s, alpha) {
  fill(255, 255, 255, alpha); // colore con trasparenza
  ellipse(x, y, s, s * 0.6);
  ellipse(x + s / 2, y + 5, s * 0.8, s * 0.5);
  ellipse(x - s / 2, y + 5, s * 0.8, s * 0.5);
}
