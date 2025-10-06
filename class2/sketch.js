let xMax = 400;
let yMax = 600;

let xrocket = xMax/2;
let yrocket = yMax * 0.6;

let timerate_stelle = 0;

function setup() {
  createCanvas(xMax, yMax);
}

function draw() {
  //mostrare un testo bianco 
  //che dice le coordinate del mouse

  background(20, 24, 40); //colore di sfondo

//disegnare le stelle
//120
//tre tipi di stelle
//fino a che abbiamo 120 stelle
//stelle ellipse

//ciclo 1 specifica stella a, 40
//for(let i=0; i<120; i++) {
  //let starX = (i*37) % width + (i%3) * 5;
  //let starY = (i*73) % height + (i%7);
  //operatore modulo %
  //stella a quando i è pari
  //if( i % 2 == 0){
 // fill (255, 255, 150);
  //ellipse(starX, starY, 1);
  //stella b
  //ci saranno per ogni i divisibile per 3
//}else if ( i % 3 == 0) {
  //fill (200, 100, 255);
  //ellipse(starX, starY, 1.5);
//}else {
  //stella c
 // fill (255, 255, 100);
 // ellipse (starX, starY, 2.5);
//}}

frameRate(30);
if (timerate_stelle % 30 == 0){
  push();
  // 3 cicli
  noStroke();
    timerate_stelle = timerate_stelle + 1;
  for(let i=0; i<120; i++) {
  let starX = random (0, xMax);
  let starY = random (0, yMax);
  if( i % 2 == 0){
  fill (255, 255, 150);
  ellipse(starX, starY, 1);
    //stella b
    //ci saranno per ogni i divisibile per 3
  }else if ( i % 3 == 0) {
    fill (200, 100, 255);
    ellipse(starX, starY, 1.5);
  }else {
    //stella c
  fill (255, 255, 100);
  ellipse (starX, starY, 2.5);
  }}

  pop();
}

timerate_stelle = timerate_stelle + 1;


fill(255); //bianco
textSize(15); //dimensione testo
//stringa, x, y
text("mouseX:" + mouseX + ", mouseY:" + mouseY, 20, 20)

//inserire contesto di disegno
push();
fill(220);
stroke(48);
//rect(23, 50, 100, 200);

//alternativa --> lo fa partire dal centro
rectMode(CENTER);
rect(xrocket, yrocket+30, 80, 180, 20); 
//quinto parametro determina la smoothness

//triangolo
fill(200, 40, 40)
triangle(xrocket-40, yrocket-60, xrocket+40, yrocket-60, xrocket, yrocket-120);

fill(200, 40, 40)
triangle(xrocket-40, yrocket+100,xrocket-60, yrocket+100, xrocket-40, yrocket+10);
triangle(xrocket+40, yrocket+100,xrocket+60, yrocket+100, xrocket+40, yrocket+10);

//cerchio
fill(40,150,220);
stroke(255);
strokeWeight(3);
ellipse(xrocket, yrocket+30, 48, 48);

//finire contesto
pop();

push();
yrocket = (yrocket -1);
//quando la yrocket sarà oltre una certa soglia
//allora dobbiamo resettare la yrocket
let soglia = -yMax * 0.6;
if (yrocket < soglia) {
yrocket = yMax;}

pop();



}