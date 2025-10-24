// variabili globali
let tableCharlie, tableAlfa, tableBravo;
let tableSoloCharlie;
let datasets = [];
let dataSolo = [];

// caricamento dei CSV
function preload() {
  tableSoloCharlie = loadTable("drone_charlie_data.csv", "csv", "header"); // solo Charlie
  tableCharlie = loadTable("drone_charlie_data.csv", "csv", "header");
  tableAlfa = loadTable("drone_alfa_data.csv", "csv", "header");
  tableBravo = loadTable("drone_bravo_data.csv", "csv", "header");
}

// setup del canvas e inizializzazione dei grafici 
function setup() {
  createCanvas(900, 1100); // canvas alto per due grafici uno sotto l'altro
  background(15);
  textFont("Helvetica");

  // primo grafico: solo drone Charlie 
  dataSolo = [];
  for (let r = 0; r < tableSoloCharlie.getRowCount(); r++) {
    let timestamp = float(tableSoloCharlie.getString(r, "timestamp"));
    let y = float(tableSoloCharlie.getString(r, "y_pos"));
    let vx = float(tableSoloCharlie.getString(r, "x_vel"));
    let vy = float(tableSoloCharlie.getString(r, "y_vel"));
    let speed = sqrt(vx * vx + vy * vy); // calcolo della velocità
    dataSolo.push({ timestamp, y, speed });
  }

  // calcolo media e deviazione standard della velocità
  let speedsSolo = dataSolo.map(d => d.speed);
  let meanSpeedSolo = speedsSolo.reduce((a, b) => a + b, 0) / speedsSolo.length;
  let stdSpeedSolo = sqrt(speedsSolo.map(v => (v - meanSpeedSolo) ** 2).reduce((a, b) => a + b, 0) / speedsSolo.length);

  // filtraggio dei movimenti più rilevanti (velocità > media + std)
  dataSolo = dataSolo.filter(d => d.speed > meanSpeedSolo + stdSpeedSolo);

  // titolo 
  let titleSolo = "Analisi dei movimenti dei droni:\n" +
                  "prima solo del drone Charlie nel tempo (solo movimenti rilevanti)\n" +
                  "poi confronto tra i tre droni";

  drawSingleDroneChart(dataSolo, 0, 550, titleSolo);

  // secondo grafico: confronto tra i tre droni
  datasets = [
    { name: "Charlie", table: tableCharlie, c1: "#00f2ff", c2: "#ff0077" },
    { name: "Alfa", table: tableAlfa, c1: "#39ff14", c2: "#ffea00" },
    { name: "Bravo", table: tableBravo, c1: "#ff00ff", c2: "#00ffff" }
  ];

  drawMultiDroneChart(datasets, 550, 1100);
}

// funzione per disegnare il grafico di un singolo drone 
function drawSingleDroneChart(data, yOffsetTop, yOffsetBottom, chartTitle) {
  // margini del grafico
  let marginLeft = 80;
  let marginRight = 50;
  let marginTop = yOffsetTop + 60;
  let marginBottom = yOffsetBottom - 80;

  // calcolo range dati
  let minT = min(data.map(d => d.timestamp));
  let maxT = max(data.map(d => d.timestamp));
  let minY = min(data.map(d => d.y));
  let maxY = max(data.map(d => d.y));
  let minSpeed = min(data.map(d => d.speed));
  let maxSpeed = max(data.map(d => d.speed));

  // disegno assi principali
  stroke(200);
  line(marginLeft, yOffsetBottom - 80, width - marginRight, yOffsetBottom - 80); // X
  line(marginLeft, yOffsetBottom - 80, marginLeft, yOffsetTop + 60); // Y

  // titolo grafico
  noStroke();
  fill(220);
  textAlign(CENTER);
  textSize(14);
  text(chartTitle, width / 2, yOffsetTop + 25);

  // assi X con tacche e numeri
  textSize(10);
  textAlign(CENTER, TOP);
  let xTicks = 5;
  for (let i = 0; i <= xTicks; i++) {
    let t = lerp(minT, maxT, i / xTicks);
    let x = map(t, minT, maxT, marginLeft, width - marginRight);
    stroke(100);
    line(x, yOffsetBottom - 80 - 5, x, yOffsetBottom - 80 + 5);
    noStroke();
    text(nf(t, 0, 1), x, yOffsetBottom - 80 + 10);
  }
  text("Tempo (timestamp)", width / 2, yOffsetBottom - 40);

  // assi Y con tacche e numeri 
  textAlign(RIGHT, CENTER);
  let yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    let yVal = lerp(minY, maxY, i / yTicks);
    let y = map(yVal, minY, maxY, yOffsetBottom - 80, yOffsetTop + 60);
    stroke(100);
    line(marginLeft - 5, y, marginLeft + 5, y);
    noStroke();
    text(nf(yVal, 1, 3), marginLeft - 10, y);
  }

  // etichetta asse Y ruotata
  push();
  translate(25, (yOffsetTop + yOffsetBottom) / 2);
  rotate(-HALF_PI);
  text("Posizione Y", 0, 0);
  pop();

  // traiettoria colorata in base alla velocità
  noFill();
  for (let i = 1; i < data.length; i++) {
    let x1 = map(data[i - 1].timestamp, minT, maxT, marginLeft, width - marginRight);
    let y1 = map(data[i - 1].y, minY, maxY, yOffsetBottom - 80, yOffsetTop + 60);
    let x2 = map(data[i].timestamp, minT, maxT, marginLeft, width - marginRight);
    let y2 = map(data[i].y, minY, maxY, yOffsetBottom - 80, yOffsetTop + 60);
    let c = map(data[i].speed, minSpeed, maxSpeed, 0, 1);
    stroke(lerpColor(color("#0044ff"), color("#ff5500"), c)); // blu → arancione
    strokeWeight(2);
    line(x1, y1, x2, y2);
  }
}

// funzione per disegnare il grafico comparativo di più droni
function drawMultiDroneChart(datasets, yOffsetTop, yOffsetBottom, chartTitle) {
  // margini del grafico
  let marginLeft = 80;
  let marginRight = 50;
  let marginTop = yOffsetTop + 60;
  let marginBottom = yOffsetBottom - 80;

  // assi principali
  stroke(200);
  line(marginLeft, yOffsetBottom - 80, width - marginRight, yOffsetBottom - 80); // X
  line(marginLeft, yOffsetBottom - 80, marginLeft, yOffsetTop + 60); // Y

  // titolo grafico
  noStroke();
  fill(220);
  textAlign(CENTER);
  textSize(14);
  text(chartTitle, width / 2, yOffsetTop + 25);

  // assi X
  textSize(10);
  textAlign(CENTER, TOP);
  text("Tempo (timestamp)", width / 2, yOffsetBottom - 40);

  // assi Y
  push();
  translate(25, (yOffsetTop + yOffsetBottom) / 2);
  rotate(-HALF_PI);
  text("Posizione Y", 0, 0);
  pop();

  // loop su ciascun dataset per tracciare le traiettorie
  for (let ds of datasets) {
    let data = [];
    for (let r = 0; r < ds.table.getRowCount(); r++) {
      let timestamp = float(ds.table.getString(r, "timestamp"));
      let y = float(ds.table.getString(r, "y_pos"));
      let vx = float(ds.table.getString(r, "x_vel"));
      let vy = float(ds.table.getString(r, "y_vel"));
      let speed = sqrt(vx * vx + vy * vy);
      data.push({ timestamp, y, speed });
    }

    // filtraggio dei movimenti più rilevanti
    let speeds = data.map(d => d.speed);
    let meanSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    let stdSpeed = sqrt(speeds.map(v => (v - meanSpeed) ** 2).reduce((a, b) => a + b, 0) / speeds.length);
    data = data.filter(d => d.speed > meanSpeed + stdSpeed);

    // range dati
    let minT = min(data.map(d => d.timestamp));
    let maxT = max(data.map(d => d.timestamp));
    let minY = min(data.map(d => d.y));
    let maxY = max(data.map(d => d.y));
    let minSpeed = min(data.map(d => d.speed));
    let maxSpeed = max(data.map(d => d.speed));

    // traiettoria colorata per ciascun drone
    noFill();
    for (let i = 1; i < data.length; i++) {
      let x1 = map(data[i - 1].timestamp, minT, maxT, marginLeft, width - marginRight);
      let y1 = map(data[i - 1].y, minY, maxY, yOffsetBottom - 80, yOffsetTop + 60);
      let x2 = map(data[i].timestamp, minT, maxT, marginLeft, width - marginRight);
      let y2 = map(data[i].y, minY, maxY, yOffsetBottom - 80, yOffsetTop + 60);
      let c = map(data[i].speed, minSpeed, maxSpeed, 0, 1);
      stroke(lerpColor(color(ds.c1), color(ds.c2), c)); // interpolazione colore tra due estremi
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }
  }

  // legenda dei droni con colore 
  let xLabel = 150;
  for (let ds of datasets) {
    fill(ds.c2);
    noStroke();
    ellipse(xLabel, yOffsetTop + 20, 10, 10);
    fill(220);
    text(ds.name, xLabel + 20, yOffsetTop + 20);
    xLabel += 130;
  }
}




