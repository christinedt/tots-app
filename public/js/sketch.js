var TotsUno, 
    options, 
    sliderValue, 
    sketch,
    socket,
    slider,
    isActiveTotMode = false,
    sliderOptions = {};

function setup() {
  // socket = io.connect('https://boiling-escarpment-82743.herokuapp.com/');
  // socket.on('mouse',
  //   function(data) {
  //     // Draw a blue circle
  //     fill(0,0,255);
  //     noStroke();
  //     ellipse(data.x,data.y,80,80);
  //   }
  // );

  sketch = createCanvas(window.innerWidth, window.innerHeight, 'p2d')
    .parent("sketch-container");

  activeTotButton = createButton('NO', true)
    .parent("active-tot-button")
    .class("button-input")
    .id("active-tot-control")
    .mousePressed(toggleActiveTotMode);
  
  totSlider = createSlider(2, 16, sliderSettings.totSlider)
    .parent("tot-slider")
    .class("control-input")
    .id("tot-control");
  
  diversitySlider = createSlider(20, 255, sliderSettings.diversitySlider)
    .parent("diversity-slider")
    .class("control-input")
    .id("diversity-control");
  
  sensitivitySlider = createSlider(5, 30, sliderSettings.sensitivitySlider)
    .parent("sensitivity-slider")
    .class("control-input")
    .id("sensitivity-control");
  
  bounceSlider = createSlider(0, 1, sliderSettings.bounceSlider)
    .parent("bounce-slider")
    .class("control-input switch")
    .id("bounce-control");
  
  pairSlider = createSlider(0, 1, sliderSettings.pairSlider)
    .parent("pair-slider")
    .class("control-input switch")
    .id("pair-control");
  
  backgroundSlider = createSlider(0, 255, sliderSettings.backgroundSlider)
    .parent("background-slider")
    .class("control-input")
    .id("background-control");

  colorMode(HSB, 255);
  frameRate(10);

  options = {
    hue: 10
  };
  TotsUno = new TotSystem(options);
  setSliderOptions();


  $('.control-input').on('change', function(e){
    setSliderOptions(e);
  });
}

function draw() {
  background(backgroundSlider.value(), 25);

  TotsUno.runTots(sliderOptions);
}

function setSliderOptions(e) {
  if(e){
    console.log(e.currentTarget.id);
  }
  sliderOptions.totAmount = totSlider.value();
  sliderOptions.activeTotMode = isActiveTotMode;
  sliderOptions.isPassThrough = bounceSlider.value();
  sliderOptions.isPairing = pairSlider.value();
  sliderOptions.diversityValue = diversitySlider.value();
  sliderOptions.sensitivityValue = sensitivitySlider.value();
}

function toggleActiveTotMode() {
  var $activeTotContainer = $("#active-tot-container");

  isActiveTotMode = !isActiveTotMode;

  $activeTotContainer.toggleClass('on');

  if(isActiveTotMode){
    activeTotButton.html('YES');
    activeTotButton.addClass('on');    
  } else {
    activeTotButton.html('NO');
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

// function mouseDragged() {
//   // Make a little object with mouseX and mouseY
//   var data = {
//     x: mouseX,
//     y: mouseY
//   };
//   // Send that object to the socket
//   socket.emit('mouse',data);
// }

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}