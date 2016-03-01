var TotsUno, 
    options, 
    sliderValue, 
    sketch,
    socket,
    slider,
    isActiveTotMode = false,
    sliderOptions = {};

function setup() {
  socket = io.connect('https://boiling-escarpment-82743.herokuapp.com/');
  socket.on('mouse',
    function(data) {
      // Draw a blue circle
      fill(0,0,255);
      noStroke();
      ellipse(data.x,data.y,80,80);
    }
  );

  sketch = createCanvas(windowWidth, windowHeight)
    .parent("sketch-container");

  activeTotButton = createButton('OFF', true)
    .parent("active-tot-button")
    .class("button-input")
    .id("active-tot-control")
    .mousePressed(toggleActiveTotMode);
  
  totSlider = createSlider(2, 16, 2)
    .parent("tot-slider")
    .class("control-input")
    .id("tot-control");
  
  diversitySlider = createSlider(20, 255, 100)
    .parent("diversity-slider")
    .class("control-input")
    .id("diversity-control");
  
  bounceSlider = createSlider(0, 1, 1)
    .parent("bounce-slider")
    .class("control-input switch")
    .id("bounce-control");
  
  pairSlider = createSlider(0, 1, 1)
    .parent("pair-slider")
    .class("control-input switch")
    .id("pair-control");
  
  backgroundSlider = createSlider(0, 255, 10)
    .parent("background-slider")
    .class("control-input")
    .id("background-control");

  colorMode(HSB);
  frameRate(10);

  options = {
    totSize: 10
  };
  TotsUno = new TotSystem(options);
  setSliderOptions();


  $('input').on('change', function(e){
    setSliderOptions(e);
  });
}

function draw() {
  background(backgroundSlider.value());

  TotsUno.runTots(sliderOptions);
}

function setSliderOptions(e) {
  sliderOptions.totAmount = totSlider.value();
  sliderOptions.activeTotMode = isActiveTotMode;
  sliderOptions.isPassThrough = bounceSlider.value();
  sliderOptions.isPairing = pairSlider.value();
  sliderOptions.diversityValue = diversitySlider.value();
}

function toggleActiveTotMode() {
  var $activeTotContainer = $("#active-tot-container");

  isActiveTotMode = !isActiveTotMode;

  $activeTotContainer.toggleClass('on');

  if(isActiveTotMode){
    activeTotButton.html('ON');
    activeTotButton.addClass('on');    
  } else {
    activeTotButton.html('OFF');
    activeTotButton.removeClass('on');
  }

  setSliderOptions();
}

/*
  SYSTEM FUNCTIONS
*/

function mousePressed() {
  if(isActiveTotMode){
    TotsUno.checkActiveTot(mouseX, mouseY);
  }
}

function mouseDragged() {
  // Make a little object with mouseX and mouseY
  var data = {
    x: mouseX,
    y: mouseY
  };
  // Send that object to the socket
  socket.emit('mouse',data);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}