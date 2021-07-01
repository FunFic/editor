/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1225159

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

const INTERVAL = 3000;
const DURATION = 2000;
const AMPLITUDE = 2;
const RANDOMNESS = 10;

var data =
`|F| back part
rgb 60, 95, 111
29.5, 88
155.5, 21
166, 94.5
105, 128.5
51, 209.5
57.5, 332
33, 351.5
7.5, 318
---
|F| Front part
rgb 251, 203, 207
35.5, 216
136.5, 178
144, 229.5
91.5, 239
33.5, 252
---
|U|
rgb 251, 203, 207
219.5, 153
259, 144.5
258, 212.5
293, 220.5
292, 139.5
343.5, 142
370.5, 299
285, 354.5
193.5, 300
---
|N| back part
rgb 60, 95, 111
416.5, 218
418.5, 137
469, 92.5
478, 177.5
468.5, 275
426.5, 285
---
|N| Front part
rgb 251, 203, 207
469.5, 134
574.5, 128
632.5, 324
560, 336.5
549, 240.5
520, 251.5
518, 337.5
445.5, 325
---
|F| back part
rgb 60, 95, 111
719.5, 88
845.5, 21
856, 94.5
795, 128.5
741, 209.5
747.5, 332
723, 351.5
697.5, 318
---
|F| Front part
rgb 251, 203, 207
725.5, 216
826.5, 178
834, 229.5
781.5, 239
723.5, 252
---
|I| Front part
rgb 251, 203, 207
901.5, 164
931.5, 100
965, 109.5
956, 169.5
968.5, 271
983, 339.5
916.5, 322
---
|I| Brack part
rgb 60, 95, 111
906.5, 59
982.5, 59
997.5, 131
939, 155.5
891.5, 128
---
|C|
rgb 60, 95, 111
1042.5, 159
1165.5, 108
1170, 192.5
1136, 201.5
1127, 231.5
1145, 252.5
1182, 255.5
1183.5, 337
1050.5, 308`;

var colors = [];
var points = [];
var originalPoints = [];

var textBox = [];
var textBoxEl, textBoxWidth, textBoxHeight;

function setup() {
  createCanvas(windowWidth, document.documentElement.scrollHeight);
  noStroke();
  
  points.push([]);
  originalPoints.push([]);
  var lines = data.split("\n");
  lines.forEach(line => {
    if (!isNaN(line.charAt(0))){
      var x = parseFloat(line.split(", ")[0]);
      var y = parseFloat(line.split(", ")[1]);
      points[points.length-1].push(createVector(x, y));
      originalPoints[originalPoints.length-1].push(createVector(x, y));
    }else if(line.charAt(0) == "-"){
      points.push([]);
      originalPoints.push([]);
    }else if(line.substring(0, 3) == "rgb"){
      var values = line.substring(3).split(", ");
      colors.push(color(values[0], values[1], values[2]));
    }
  });
  
  for (let j=0; j < points.length; j++){
    setTimeout(() => {
      for (let i=0; i < points[j].length; i++){
        twist(points[j][i], originalPoints[j][i]);
      }
    }, j*100);  
  }

  textBox.push(createVector(111, 16));
  textBox.push(createVector(310, 33));
  textBox.push(createVector(531, 17));
  textBox.push(createVector(715, 13));
  textBox.push(createVector(825, 22));
  textBox.push(createVector(864, 77));
  textBox.push(createVector(866, 198));
  textBox.push(createVector(873, 286));
  textBox.push(createVector(834, 331));
  textBox.push(createVector(655, 331));
  textBox.push(createVector(454, 341));
  textBox.push(createVector(276, 343));
  textBox.push(createVector(106, 340));
  textBox.push(createVector(34, 329));
  textBox.push(createVector(29, 205));
  textBox.push(createVector(19, 68));
  for (let i=0; i < textBox.length; i++){
    twist(textBox[i], createVector(textBox[i].x, textBox[i].y));
  }
  updateTextBoxSize();
}

function twist(current, original){
  var tween = createjs.Tween.get(current).to({
    x: original.x + random(-RANDOMNESS, RANDOMNESS),
    y: original.y + random(-RANDOMNESS, RANDOMNESS)
  }, DURATION, createjs.Ease.getElasticOut(AMPLITUDE,0.3));
  setTimeout(() => twist(current, original), INTERVAL);
}

function draw() {
  background(255);

  {//logo
    const shapeMinWidth = 400;
    const shapeWidth = 1220;
    const finalWidth = min(shapeMinWidth, width - 120);
    push();
    translate((width - finalWidth) / 2, 60 * shapeMinWidth / finalWidth);
    scale(finalWidth / shapeWidth);
    points.forEach((arr, index) => {
      fill(colors[index]);
      beginShape();
      for (let i=0; i < arr.length + 3; i++){
        var p = arr[i%arr.length];
        curveVertex(p.x, p.y);
      }
      endShape();
    });
    pop();
  }
  
  {//text box
    const shapeWidth = 880;
    const finalWidth = textBoxWidth+200;
    const shapeHeight = 340;
    const finalHeight = textBoxHeight+50;
    push();
    translate(width/2, 200);
    scale(finalWidth/shapeWidth, finalHeight/shapeHeight)
    translate(-shapeWidth/2, 0);
    fill(252, 241, 230);
    beginShape();
    for (let i=0; i < textBox.length + 3; i++){
      var p = textBox[i%textBox.length];
      curveVertex(p.x, p.y);
    }
    endShape();
    pop();
  }
}

function updateTextBoxSize(){
  if(!textBoxEl)
    textBoxEl = document.getElementById("opening");
  textBoxWidth = textBoxEl.offsetWidth;
  textBoxHeight = textBoxEl.offsetHeight;
}

function windowResized() {
  updateTextBoxSize();
  resizeCanvas(windowWidth, document.documentElement.scrollHeight);
}