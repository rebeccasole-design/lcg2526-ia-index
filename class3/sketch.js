let xMax = 400;
let yMax = 600;

let xrocket = xMax/2;
let yrocket = yMax * 0.6;

let timerate_stelle = 0;

let table;
let star_img;

function preload() {
  //caricare immagini
  //img = loadImage('path');
  table = loadTable('stars.csv', 'csv', 'header');
  star_img = loadImage('star.png');
}

function setup() {
  createCanvas(xMax, yMax);
}

function drawSigleStarFromFile(index, posX, posY) {
  let starSize = table.getNum(index, "starSize");
  image(star_img, posX, posY, starSize, starSize);
}

function drawStarsFromFile(){
  for(let k = 0;k < table.getRowCount(); k++){
    let starX = (k*37) % width + (k%3) * 5;
    let starY = (k*73) % height + (k%7);
    drawSigleStarFromFile(k, starX, starY);
  }
}
//si può scrivere sia sopra che sotto 
// rispetto a dove utilizzo la funzione
function drawSingleStar(i, starX, starY, random_trasparency, random_size){
 if( i % 2 == 0){
  fill (255, 255, 150);
  ellipse(starX, starY, 3.5);
    //stella b
    //ci saranno per ogni i divisibile per 3
  }else if ( i % 3 == 0) {
    fill (255, 260, 255);
    ellipse(starX, starY, 4);
  }else {
    //stella c
  fill (255, 255, 100);
  ellipse (starX, starY, 2.5);
  }
return;
}

function drawStars(num_stars=0){
  for(let i=0; i<num_stars; i++) {
    let starX = random (0, xMax);
    let starY = random (0, yMax);

    random_trasparency = random (150, 225);
    random_size = random (2.8, 255);
    let random_x = random (0, width);
    let random_y = random (0, height);

  drawSingleStar(i, starX, starY, random_trasparency, random_size);
return;
}
}
function razzo(xrocket, yrocket){
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

return;
}

function moveRocket(yrocket, step=1){
  yrocket = (yrocket -step);
//quando la yrocket sarà oltre una certa soglia
//allora dobbiamo resettare la yrocket
let soglia = -yMax * 0.6;
if (yrocket < soglia) {
yrocket = yMax;}

return yrocket;
  }



function draw() {
  //mostrare un testo bianco 
  //che dice le coordinate del mouse

  background(200, 280, 40); //colore di sfondo

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

//drawStars(120);

  razzo(xrocket, yrocket);
pop();

timerate_stelle = timerate_stelle + 1;

drawStarsFromFile();
//finire contesto
pop();

push();
yrocket=moveRocket(yrocket, 1);
pop();



}