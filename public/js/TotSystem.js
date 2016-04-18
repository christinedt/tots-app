//Tot System
function TotSystem(options) {
  var totRunOptions = {},
      totOptions = {
        totSize: 20
      },
      mouseClickVector,
      activeTot;

  var totSystemView = this;
  
  totSystemView.tots = []

  this.addTot = function(options){
    var newTot = new Tot(options);
    totSystemView.tots.push(newTot);
  }
  
  // Every frame, operate the tots
  this.runTots = function(sliderOptions){
    this.setTotRunOptions(sliderOptions);

    // if there are no tots, create the self tot
    if(totSystemView.tots.length === 0){
      this.addTot(sketchSelfTotSettings);
    }

    // if the slider value of tots is more than the current amount of tots, 
    // add new tots until it is the same amount
    if(sliderOptions.totAmount > totSystemView.tots.length) {
      for(var i = totSystemView.tots.length; i < sliderOptions.totAmount; i++){
        this.addTot(totOptions);
      }
      // or, if the slider value of tots is less than the current amount of tots,
      // remove tots until the amounts are the same
    } else if(sliderOptions.totAmount < totSystemView.tots.length) {
      for(var i = sliderOptions.totAmount; i < totSystemView.tots.length; i++){
        totSystemView.tots.pop();
      }
    }
    // every frame, run each tot in the tot system
  	totSystemView.tots.forEach(this.runTot);
  }


  // This is the function that is called every frame for each tot in the 
  // tot system.
  this.runTot = function(tot, index, tots) {
  	tot.run(tots, totRunOptions);
  }

  this.setTotRunOptions = function(sliderOptions) {
    var tempFieldSize;
    tempFieldSize = 500 - 25 * (sliderOptions.totAmount - 2);
    if(sliderOptions.totAmount == 2) {
      tempFieldSize = 2000;
    }
    totRunOptions.forceValue = sliderOptions.forceValue;
    totRunOptions.activeTotMode = sliderOptions.activeTotMode;
    totRunOptions.isPassThrough = sliderOptions.isPassThrough;
    totRunOptions.isPairing = sliderOptions.isPairing;
    totRunOptions.diversityValue = sliderOptions.diversityValue;
    totRunOptions.fieldSize = tempFieldSize;
  }

  this.checkActiveTot = function(xPos, yPos) {
    mouseClickVector = createVector(xPos, yPos);

    totSystemView.tots.forEach(this.setActiveTotIndex);
    totSystemView.tots.forEach(this.setActiveTot);
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