//Tot System
function TotSystem(options) {
  var tots = [],
      totRunOptions = {},
      totOptions = {
        totSize: 10
      },
      mouseClickVector,
      activeTot;

  this.addTot = function(options){
    var newTot = new Tot(options);
    tots.push(newTot);
  }
  
  this.runTots = function(sliderOptions){
    this.setTotRunOptions(sliderOptions);
    if(tots.length === 0){
      this.addTot(sketchSelfTotSettings);
    }
    if(sliderOptions.totAmount > tots.length) {
      for(var i = tots.length; i < sliderOptions.totAmount; i++){
        this.addTot(totOptions);
      }
    } else if(sliderOptions.totAmount < tots.length) {
      for(var i = sliderOptions.totAmount; i < tots.length; i++){
        tots.pop();
      }
    }

  	tots.forEach(this.runTot);
  }

  this.runTot = function(tot, index, tots) {
  	tot.run(tots, totRunOptions);
  }

  this.setTotRunOptions = function(sliderOptions) {
    var tempFieldSize;

    tempFieldSize = 700 - 45 * (sliderOptions.totAmount - 2);
    totRunOptions.forceValue = sliderOptions.forceValue;
    totRunOptions.activeTotMode = sliderOptions.activeTotMode;
    totRunOptions.isPassThrough = sliderOptions.isPassThrough;
    totRunOptions.isPairing = sliderOptions.isPairing;
    totRunOptions.diversityValue = sliderOptions.diversityValue;
    totRunOptions.fieldSize = tempFieldSize;
  }

  this.checkActiveTot = function(xPos, yPos) {
    mouseClickVector = createVector(xPos, yPos);

    tots.forEach(this.setActiveTotIndex);
    tots.forEach(this.setActiveTot);
  }

  this.setActiveTotIndex = function(tot, index, tots) {
    var vectorToMouse, mouseDistance;
    
    vectorToMouse = p5.Vector.sub(tot.position, mouseClickVector);
    mouseDistance = vectorToMouse.mag();

    if(mouseDistance <= tot.radius) {
      activeTot = index;
    }
  }

  this.setActiveTot = function(tot, index, tots) {
    if(activeTot === index) {
      tot.isActiveTot = true;
    } else {
      tot.isActiveTot = false;
    }
  }
}