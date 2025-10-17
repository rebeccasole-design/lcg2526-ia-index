// variabili globali
// colori iniziali del cielo (giorno)
let red = 135;
let green = 206;
let blue = 235;

let sun = 100; // posizione verticale del sole (y)

let skyFade = 0; // controlla la transizione cielo giorno → notte

let stars = []; // array per memorizzare stelle

// nuvole che si muovono
let cloudOffsets = [0, 0, 0]; // spostamento orizzontale delle 3 nuvole (si muovono lentamente)

// variabili per il sole
let sunAngle = 0;   // rotazione
let sunPulse = 0;   // pulsazione (espansione/contrazione)

// oscillazione delle montagne
let mountainOffset = 0;
let mountainDir = 1;



// SETUP
function setup() {
  createCanvas(1000, 400);
  noStroke();

  // genera stelle casuali (posizione, dimensione, luminosità)
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      size: random(1, 3),
      brightness: random(150, 255)
    });
  }
}


// draw (contiene il loop principale)
function draw() {

  // transizione giorno → notte 
  if (skyFade < 510) {
    skyFade += 0.5;
  } else {
    // reset dopo la notte
    skyFade = 0;
    sun = 100;
  }

  // mappatura colori del cielo 
  // cambia gradualmente colore in base a skyFade
  if (skyFade < 255) {
    red = map(skyFade, 0, 255, 135, 255);
    green = map(skyFade, 0, 255, 206, 80);
    blue = map(skyFade, 0, 255, 235, 100);
  } else {
    red = map(skyFade, 255, 510, 255, 20);
    green = map(skyFade, 255, 510, 80, 30);
    blue = map(skyFade, 255, 510, 100, 60);
  }

  background(red, green, blue);

  // movimento verticale del sole
  if (sun < 420) sun += 0.5; // scende lentamente verso il basso


  // SOLE (rotazione + pulsazione)
  if (sun < 400) {
    sunAngle += 0.02;   // incremento della rotazione
    sunPulse += 0.05;   // incremento della pulsazione
    let pulseFactor = 1 + 0.15 * sin(sunPulse); // calcola quanto “pulsare”

    // salva le impostazioni grafiche correnti
    push();

   
    // TRASFORMAZIONI:
    
    // 1. translate(x, y)
    //    sposta l'origine del sistema di coordinate nel punto (500, sun)
    //    tutto ciò che viene disegnato dopo sarà relativo a questo nuovo centro
    translate(500, sun);

    // 2. rotate(angle)
    //    ruota il sistema di coordinate attorno alla nuova origine
    //    tutte le forme successive ruoteranno attorno al sole
    rotate(sunAngle);

    // NOTA:
    // se disegnassimo rettangoli o ellissi ora, essi ruoterebbero
    // intorno al centro del sole, perché la rotazione agisce sul sistema
    // di coordinate, non sugli oggetti in sé.

    // disegno dei raggi
    let rays = 16; // numero di raggi
    let rayLength = 70 * pulseFactor;
    let rayWidth = 12 * pulseFactor;

    for (let i = 0; i < rays; i++) {
      push(); // salviamo lo stato locale per ogni raggio
      // ruota ogni raggio attorno al centro
      rotate((TWO_PI / rays) * i);
      // disegna il raggio con piccola sfumatura
      for (let j = 0; j < 5; j++) {
        let grad = map(j, 0, 5, 255, 100);
        fill(255, 220, 100, grad / 3);
        rect(-rayWidth / 2, 0, rayWidth, rayLength * (0.7 + j * 0.07));
      }
      pop();
    }

    // bagliore esterno del sole
    noStroke();
    for (let i = 0; i < 3; i++) {
      fill(255, 230, 100, 80 - i * 25);
      ellipse(0, 0, 160 * pulseFactor * (1 + i * 0.1));
    }

    // centro del sole 
    fill(255, 200, 0);
    ellipse(0, 0, 80 * pulseFactor);

    // ripristina il sistema di coordinate originale
    // (altrimenti ruoterebbe anche tutto il resto!)
    pop();
  }


  // luna
  if (skyFade > 350) {
    let moonY = map(skyFade, 350, 510, 400, 120);
    fill(255, 255, 230, map(skyFade, 350, 510, 0, 255));
    circle(800, moonY, 60);
    fill(20, 20, 50, map(skyFade, 350, 510, 0, 200));
    circle(790, moonY - 5, 60);
  }

  // stelle
  if (skyFade > 320) {
    for (let s of stars) {
      fill(255, 255, 255, map(skyFade, 320, 510, 0, s.brightness));
      circle(s.x, s.y, s.size);
    }
  }


  // mpntagne che oscillano
  mountainOffset += 0.1 * mountainDir;
  if (mountainOffset > 5 || mountainOffset < -5) mountainDir *= -1;

  // uso di lerpColor() per sfumare i colori delle montagne col tempo
  fill(lerpColor(color(100, 60, 20), color(30, 20, 10), skyFade / 510));
  triangle(0, 400 + mountainOffset, 250, 220 + mountainOffset, 500, 400 + mountainOffset);

  fill(lerpColor(color(130, 80, 30), color(50, 30, 15), skyFade / 510));
  triangle(500, 400 + mountainOffset, 750, 220 + mountainOffset, 1000, 400 + mountainOffset);


  // terreno
  fill(lerpColor(color(60, 40, 20), color(20, 10, 5), skyFade / 510));
  rect(0, 380, width, 20);


  // nuvole che si muovono
  cloudOffsets[0] += 0.3;
  cloudOffsets[1] += 0.2;
  cloudOffsets[2] += 0.25;

  if (cloudOffsets[0] > width) cloudOffsets[0] = -100;
  if (cloudOffsets[1] > width) cloudOffsets[1] = -100;
  if (cloudOffsets[2] > width) cloudOffsets[2] = -100;

  let cloudAlpha = map(skyFade, 0, 300, 200, 0);
  drawCloud(200 + cloudOffsets[0], 100, 50, cloudAlpha);
  drawCloud(750 + cloudOffsets[1], 80, 40, cloudAlpha);
  drawCloud(600 + cloudOffsets[2], 130, 60, cloudAlpha);
}


// funzione per disegnare nuvole
function drawCloud(x, y, s, alpha) {
  fill(255, 255, 255, alpha);
  ellipse(x, y, s, s * 0.6);
  ellipse(x + s / 2, y + 5, s * 0.8, s * 0.5);
  ellipse(x - s / 2, y + 5, s * 0.8, s * 0.5);
}


// funzione per fermare/ripartire l'animazione 
// al click sul canvas
function mousePressed() {
    if (isLooping()) { // se l'animazione è in esecuzione
        noLoop(); // fermala
    } else {
        loop(); // altrimenti riprendi
    }
}

