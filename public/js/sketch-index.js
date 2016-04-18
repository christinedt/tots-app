var TotUno, 
    totOptions = {isSelfTot: true, personality: 128, sensitivity: 50}, 
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
  colorMode(HSB, 255);

  setSliderOptions();
  
  $('.form-input').on('input', function(e){
    setSliderOptions(e);
    $(':focus').blur();
  });

  sketch = createCanvas(window.innerWidth, window.innerHeight, 'p2d')
    .parent("sketch-container");

  TotUno = new Tot(totOptions);
}

function draw() {
  background(225, 70);

  TotUno.run(false, sliderOptions);
}

function setSliderOptions(e) {
  sliderOptions.personality = $('#inputHue').val()/360*255;
  sliderOptions.sensitivity = $('#inputSensitivity').val();
}

/*
  SYSTEM FUNCTIONS
*/

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