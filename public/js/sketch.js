var TotsUno, 
    options, 
    sliderValue, 
    sketch,
    socket,
    slider,
    isActiveTotMode = false,
    sliderOptions = {};


$(document).ready(function(){
    var $sideBar = $('#side-bar'),
        $sideBarToggle = $('#side-bar-toggle'),
        $switches = $('input.switch'),
        $blackScreen = $('.black-screen');

    $blackScreen.animate({ opacity: 0 }, 2000, 'swing', function(){
        // go to the first screen
        $blackScreen.removeClass('visible');
    });

    $("#cut-screen-button").click(function(){
      $('#cut-screen').animate({ opacity: 0 }, 1000, 'swing', function(){
        $('#cut-screen').removeClass('visible');
        loop();
      });
    });

    $("#submit").click(function(){
        sliderSettings = {
          'totSlider': $('#tot-control').val(),
          'diversitySlider': $('#diversity-control').val(),
          'sensitivitySlider': $('#sensitivity-control').val(),
          'bounceSlider': $('#bounce-control').val(),
          'pairSlider': $('#pair-control').val(),
          'backgroundSlider': $('#background-control').val(),
          'gazeSlider': $('#gaze-control').val(),
          'tensionSlider': $('#tension-control').val(),
          'bodySlider': $('#body-control').val()
        };

        sketchSelfTotSettings.introversion = TotsUno.tots[0].introversion;

        console.log('social points: ', TotsUno.tots[0].introversion);

        $.post("/sketch",{ selfTotSettings: sketchSelfTotSettings, sliderSettings: sliderSettings }, function(data){ 
            if(data==='done'){
              // fade to black
              $('.black-screen').addClass('visible').animate({ opacity: 1 }, 1000, 'swing', function(){

                  // go to the first screen
                  window.location.href="/" + nextPage;
              });
                
            }
        });
    });

    $sideBarToggle.click(function(){
        $sideBar.toggleClass('open');
    });

    $('#tot-portrait').css('background-color', 'hsla(' + Number(sketchSelfTotSettings.personality)/255 * 360 + ', 100%, 50%, 1)');
    $('.stat-value').css('background-color', 'hsla(' + Number(sketchSelfTotSettings.personality)/255 * 360 + ', 100%, 50%, 1)');
    $('.stat-value.confidence').css('width', sketchSelfTotSettings.confidence) + 'px';
    $('.stat-value.sensitivity').css('width', sketchSelfTotSettings.sensitivity) + 'px';
    $('.stat-value.sociability').css('width', sketchSelfTotSettings.sociability) + 'px';

    window.onbeforeunload = function(){
        sliderSettings = {
          'totSlider': $('#tot-control').val(),
          'diversitySlider': $('#diversity-control').val(),
          'sensitivitySlider': $('#sensitivity-control').val(),
          'bounceSlider': $('#bounce-control').val(),
          'pairSlider': $('#pair-control').val(),
          'backgroundSlider': $('#background-control').val()
        };
    };
});

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

  activeTotSlider = createSlider(0, 1, 1)
    .parent("active-tot-slider")
    .class("control-input switch off")
    .id("active-tot-control");
  
  totSlider = createSlider(2, 20, sliderSettings.totSlider)
    .parent("tot-slider")
    .class("control-input")
    .id("tot-control");
  
  diversitySlider = createSlider(20, 255, sliderSettings.diversitySlider)
    .parent("diversity-slider")
    .class("control-input")
    .id("diversity-control");
  
  bounceSlider = createSlider(0, 1, sliderSettings.bounceSlider)
    .parent("bounce-slider")
    .class("control-input toggle")
    .id("bounce-control");
  
  pairSlider = createSlider(0, 1, sliderSettings.pairSlider)
    .parent("pair-slider")
    .class("control-input switch")
    .id("pair-control");
  
  backgroundSlider = createSlider(0, 255, sliderSettings.backgroundSlider)
    .parent("background-slider")
    .class("control-input")
    .id("background-control");
  
  gazeSlider = createSlider(0, 1, sliderSettings.gazeSlider)
    .parent("gaze-slider")
    .class("control-input switch on")
    .id("gaze-control");
  
  tensionSlider = createSlider(0, 1, sliderSettings.tensionSlider)
    .parent("tension-slider")
    .class("control-input switch on")
    .id("tension-control");
  
  bodySlider = createSlider(0, 1, sliderSettings.bodySlider)
    .parent("body-slider")
    .class("control-input switch on")
    .id("body-control");


  $('.control-input').on('change', function(e){
    setSliderOptions(e);
  });

  $('.control-input.switch').on('change', function(e){
    $(e.currentTarget).toggleClass("off on");
  });

  colorMode(HSB, 255);
  frameRate(10);

  options = {
    hue: 10
  };
  TotsUno = new TotSystem(options);
  setSliderOptions();

  noLoop();

}

function draw() {
  background(backgroundSlider.value(), 80);

  TotsUno.runTots(sliderOptions);
}

function setSliderOptions(e) {
  sliderOptions.totAmount = totSlider.value();
  sliderOptions.activeTotMode = activeTotSlider.value();
  sliderOptions.isPassThrough = bounceSlider.value();
  sliderOptions.isPairing = pairSlider.value();
  sliderOptions.diversityValue = diversitySlider.value();

  globals.gazeValue = gazeSlider.value();
  globals.tensionValue = tensionSlider.value();
  globals.bodyValue = bodySlider.value();
  globals.activeTotMode = activeTotSlider.value();
}

function toggleActiveTotMode() {
  var $activeTotContainer = $("#active-tot-container");

  isActiveTotMode = !isActiveTotMode;

  $activeTotContainer.toggleClass('on');

  if(isActiveTotMode){
    activeTotSlider.html('YES');
    activeTotSlider.addClass('on');    
  } else {
    activeTotSlider.html('NO');
    activeTotSlider.removeClass('on');
  }

  setSliderOptions();
}

/*
  SYSTEM FUNCTIONS
*/

function mousePressed() {
  if(globals.activeTotMode){
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