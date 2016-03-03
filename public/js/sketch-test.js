

function setup() {

  var sketch = createCanvas(windowWidth, windowHeight)
    .parent("sketch-container");

  colorMode(HSB);
  frameRate(10);
}

function draw() {
  background(frameCount%255, 145, 145);
  textSize(32);
  text(thisIsAVariable, 100, 300);
}