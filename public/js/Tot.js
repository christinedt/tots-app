//Tot
function Tot(totInitOptions) {

  //Internal Properties

  // The variable thisTot will represent this particular instance of the Tot Class. It
  // is thi tot referring to itself.
  var thisTot = this;

  // The thisTot.* options can be accessed by all the other Tots in the same TotSystem

  // Environmental properties

  thisTot.isSelfTot = totInitOptions.isSelfTot ? totInitOptions.isSelfTot : false;
  thisTot.isPassThrough = 1;
  thisTot.isPairing = 1;
  thisTot.doRunInterference = true;
  thisTot.isActiveTot = false;

  // Display/Personality properties

  thisTot.size = 13;
  thisTot.radius = thisTot.size/2;
  thisTot.personality = totInitOptions.personality ? totInitOptions.personality : Math.floor(Math.random() * 256);
  thisTot.opacity = 255;
  thisTot.confidence = 255;
  thisTot.introversion = totInitOptions.introversion ? totInitOptions.introversion : 0;
  thisTot.lightness = 225;

  // Newtonian properties

  thisTot.position = createVector(Math.floor(Math.random() * (width-thisTot.size) + thisTot.radius), 
                                  Math.floor(Math.random() * (height-thisTot.size) + thisTot.radius));
  thisTot.velocity = p5.Vector.random2D().mult(4);
  thisTot.acceleration = createVector(0, 0);
  thisTot.forces = [];
  thisTot.driveForce = createVector(0, 0);

  // TotField properties

  thisTot.sensitivity = totInitOptions.sensitivity ? totInitOptions.sensitivity : Math.random() * 100;
  if(thisPage == "Duet") {
    thisTot.sensitivity *= 2;
  }
  thisTot.fieldRings = Math.floor(map(thisTot.sensitivity, 0, 100, 4, 40));
  thisTot.fieldPulseRate = 1;
  thisTot.fieldSize;
  thisTot.fieldPulseFrame = 0;


  var getHueDifference = function(hue1, hue2) {
    var hueDifference, hueGap;
    hueDifference = Math.abs(hue1 - hue2);

    if(hueDifference > 128) {
      hueGap = (255 - hueDifference)/2;
    } 

    return hueDifference;
  }

  if(!thisTot.isSelfTot && thisPage != "Duet"){

    while(getHueDifference(thisTot.personality, sketchSelfTotSettings.personality) < 20 || (getHueDifference(thisTot.personality, sketchSelfTotSettings.personality) > 108 )) {
      thisTot.personality = Math.floor(Math.random() * 256);
    }

  } else if(!thisTot.isSelfTot && thisPage == "Duet") {

    thisTot.personality = (sketchSelfTotSettings.personality + 128)%255;

  }


  
  //thisTot.run(tots)
  //This is the function that runs every draw cycle. Controls
  //basic operation of the tot's various components
  thisTot.run = function(tots, totRunOptions) {
    if(totRunOptions){
      thisTot.setVariables(totRunOptions);
    }
    if(tots){
      thisTot.update(tots);
    } else {
      thisTot.update();
    }
    thisTot.display();
    thisTot.reset();
  }

  thisTot.setVariables = function(totRunOptions) {
    if(thisPage == "Index"){
      thisTot.personality = totRunOptions.personality;
      thisTot.fieldRings = Math.floor(map(totRunOptions.sensitivity, 0, 100, 4, 40));
      thisTot.fieldSize = 800;
      thisTot.isPassThrough = 1;
    } else {
      thisTot.pushForce = totRunOptions.forceValue;
      thisTot.isPassThrough = totRunOptions.isPassThrough;
      thisTot.isPairing = totRunOptions.isPairing;
      thisTot.confidence = totRunOptions.diversityValue;
      
      thisTot.fieldSize = totRunOptions.fieldSize;
    }

    thisTot.fieldRadius = thisTot.fieldSize/2;
    thisTot.fieldIncrement = thisTot.fieldRadius/thisTot.fieldRings;
    thisTot.fieldIncrementMultiplier = Math.random() * 2 + 1;

    // if(thisPage == "Duet") {
    //   thisTot.fieldPulseRate = 1;
    // } else if(thisTot.isSelfTot){
    //   thisTot.fieldPulseRate = 0.5;
    // }
  }
  
  //thisTot.update()
  //Updates the position vectors of the Tot, no params
  thisTot.update = function(tots) {

    if(thisTot.doRunInterference && tots) {
      tots.forEach(thisTot.runInterference, this);
    }

    if(thisTot.isSelfTot && globals.activeTotMode) {
      thisTot.driveTot();
    }

    for(var i = 0; i < thisTot.forces.length; i++) {
      thisTot.acceleration.add(thisTot.forces[i].x, thisTot.forces[i].y);
    }

    thisTot.velocity.add(thisTot.acceleration.x, thisTot.acceleration.y);
    if(thisPage == "Index") {
      thisTot.velocity.limit(3);
    } else {
      thisTot.velocity.limit(7);
    }
    thisTot.position.add(thisTot.velocity.x, thisTot.velocity.y);
    if(thisTot.isPassThrough === 1){
      thisTot.passThrough();
    } else {
      thisTot.checkForWalls();
    }
  }

  // The function that is called when the tot hits a boundary 
  // and the boundary mode is bounce
  thisTot.checkForWalls = function() {
    if((thisTot.position.x - thisTot.radius) <= 0){  
      thisTot.position.x = thisTot.radius;
      if(thisTot.velocity.x < 0){
        thisTot.velocity.x *= -1; 
      }
    }
    if((thisTot.position.x + thisTot.radius) >= width){  
      thisTot.position.x = width - thisTot.radius; 
      if(thisTot.velocity.x > 0){
        thisTot.velocity.x *= -1; 
      }
    }
    if((thisTot.position.y - thisTot.radius) <= 0){ 
      thisTot.position.y = thisTot.radius; 
      if(thisTot.velocity.y < 0){
        thisTot.velocity.y *= -1; 
      }
    }
    if((thisTot.position.y + thisTot.radius) >= height){ 
      thisTot.position.y = height - thisTot.radius; 
      if(thisTot.velocity.y > 0){
        thisTot.velocity.y *= -1; 
      }
    }
  }

  // The function that is called when the tot hits a boundary 
  // and the boundary mode is pass through
  thisTot.passThrough = function() {
    if((thisTot.position.x + thisTot.radius) <= 0){  
      thisTot.position.x = width;
    }
    if((thisTot.position.x - thisTot.radius) >= width){  
      thisTot.position.x = 0 - thisTot.radius;
    }
    if((thisTot.position.y + thisTot.radius) <= 0){ 
      thisTot.position.y = height;
    }
    if((thisTot.position.y - thisTot.radius) >= height){ 
      thisTot.position.y = 0 - thisTot.radius;
    }
  }

  thisTot.addForce = function(force, index, forces) {
    thisTot.acceleration.add(force.x, force.y);
  }
  
  //thisTot.display()
  //Runs the functions that create the visual appearance of the Tot, no params
  thisTot.display = function() {
    if(thisTot.isSelfTot){
      if(thisPage == "Index"){
        thisTot.renderField();
      } else if(thisPage !== "Duet"){
        thisTot.renderAura();
      }
    }

    if(globals.bodyValue){
      thisTot.renderTot();
    }
    if(globals.gazeValue){
      thisTot.renderTotGaze();
    }
  }
  
  thisTot.runInterference = function(bill, index, tots) {
  	var otherTot = bill,
        distance = p5.Vector.dist(thisTot.position, otherTot.position),
        dVector = p5.Vector.sub(otherTot.position, thisTot.position),
        dNormal = dVector.normalize(),
        thisRing,
        thatRing,
        thisRingIndex,
        thatRingIndex;

    // thisTot.fieldPulseFrame = thisTot.fieldPulseFrame % thisTot.fieldIncrement;

    // var thisRingIndex = thisTot.fieldIncrement,
    //     thatRingIndex = otherTot.fieldIncrement;

    thisRingIndex = thisTot.fieldPulseFrame%thisTot.fieldIncrement,
    thatRingIndex = thisTot.fieldPulseFrame%otherTot.fieldIncrement;
    
    //if otherTot is not thisTot but is within field range
    if(distance > 0 && distance < thisTot.fieldSize) {

      //for each ring of thisTot's field
      for(var thisRing = thisRingIndex; thisRing < thisTot.fieldRadius; thisRing+=thisTot.fieldIncrement) {
        //for each ring of otherTot's field
        for(var thatRing = thatRingIndex; thatRing < otherTot.fieldRadius; thatRing+=otherTot.fieldIncrement) {
          //check if the two rings intersect
          var areIntersecting = checkIntersect(
                                  thisTot.position.x, 
                                  thisTot.position.y, 
                                  thisRing, 
                                  otherTot.position.x, 
                                  otherTot.position.y, 
                                  thatRing
                                );
                                              
          switch(areIntersecting) {
          //fields intersect and have intersection points
            case 1:

              var intersections,
                  firstIntersectionPoint,
                  secondIntersectionPoint,
                  thisPushForce,
                  pushVector1,
                  pushVector2,
                  hueDifference;

              // Get intersection points

              // getInterSectionPoints() lives in the equations file
              // and returns an array of 4 floats, which are the 
              // xy coordinates for the points at which
              // thisRing intersects with thatRing
              intersections = getIntersectionPoints(
                                thisTot.position.x, 
                                thisTot.position.y, 
                                thisRing, 
                                otherTot.position.x, 
                                otherTot.position.y, 
                                thatRing
                              );

              firstIntersectionPoint = createVector(intersections[0], intersections[1]);
              secondIntersectionPoint = createVector(intersections[2], intersections[3]);

              // calculate pushForce
              if(distance < thisTot.size) {
                thisPushForce = 0;
              } else {
                thisPushForce = thisTot.calculatePushForce(thisTot, otherTot, distance, thisRing, thatRing);
              }

              pushVector1 = p5.Vector.sub(thisTot.position, firstIntersectionPoint)
                .normalize()
                .mult(thisPushForce);

              pushVector2 = p5.Vector.sub(thisTot.position, secondIntersectionPoint)
                .normalize()
                .mult(thisPushForce);

              thisTot.forces.push(pushVector1);
              thisTot.forces.push(pushVector2);


              // Render the intersection shape if you'd like to

              // The intersection shape renders if it is not active tot mode, 
              // if it is and this is the active tot, or if this is the self tot

              // if(thisTot.isActiveTot || thisTot.isSelfTot) {
              if(globals.tensionValue) {
                thisTot.renderIntersectShape(intersections, distance, otherTot.personality, thisRing, thisPushForce);
              }

              thisTot.introversion+=thisPushForce;

              if(thisTot.introversion > 200) {
                thisTot.introversion = 200;
              }

              break;

          //If one of the fields is contained in the other
            case -1:
              // renderOverlapShape(i);
              break;

            default:
              break;
          }
        }
      }
    }
  }

  thisTot.calculatePushForce = function(thisTot, otherTot, distance, thisRing, thatRing) {
    var hueDifference,
        calculatedPushForce,
        confidenceFactor;

    // hueGap returns the value that is half the distance between thisHue and otherTot.personality
    // Value will be 0 - 63.75
    hueDifference = thisTot.getHueGap(thisTot.personality, otherTot.personality);

    // if the sketch is set to pairing, the tot will seek its opposite
    // if the sketch is set to grouping, the tot will seek similar hues
    // calculatedPushForce will be 0.68 to -0.313
    if(thisTot.isPairing) {
      calculatedPushForce = (53.75 - hueDifference)/63.75;
    } else {
      calculatedPushForce = (hueDifference - 10)/63.75;
    }
      
    confidenceFactor = map(thisTot.confidence, 0, 255, 0, 1);

    // Adjust the calculatedPushForce by confidence. More confidence equals stronger force, either good or bad.
    calculatedPushForce *= confidenceFactor;

    // Adjust the push force according to which field rings the force is
    // coming from, a higher force for a closer ring
    calculatedPushForce = calculatedPushForce / (thisRing * thatRing);

    // Adjust pushForce by global push strength variable
    calculatedPushForce *= 100;

    return calculatedPushForce;
  }
  
  thisTot.renderTot = function() {

    // if(thisTot.isActiveTot || thisTot.isSelfTot) {
    //   strokeWeight(4);
    //   stroke(0, 0, 255, 100);
    // }
    if(thisTot.introversion > 0) {

      thisTot.opacity = 255 - (thisTot.introversion/2);
      thisTot.confidence = 255 - thisTot.introversion;
    } else {
      thisTot.opacity = 255;
      thisTot.confidence = 255;
    }

    if(thisTot.isSelfTot){
      strokeWeight(2);
      stroke(thisTot.personality, thisTot.confidence, thisTot.lightness, thisTot.opacity*2);
      fill(thisTot.personality, thisTot.confidence, thisTot.lightness, thisTot.opacity);

      ellipse(thisTot.position.x, thisTot.position.y, thisTot.size, thisTot.size);
    } else {
      strokeWeight(2);
      stroke(thisTot.personality, thisTot.confidence, thisTot.lightness, thisTot.opacity);
      noFill();

      ellipse(thisTot.position.x, thisTot.position.y, thisTot.size, thisTot.size);
    }

    var theta = thisTot.velocity.heading() + radians(90);

    // push();

    // translate(thisTot.position.x,thisTot.position.y);

    // rotate(theta);

    // beginShape();
    // noStroke();
    // fill(0);

    // ellipse(-size/4, -size/4, 2, 2);
    // ellipse(size/4, -size/4, 2, 2);

    // endShape();

    // pop();
  }

  thisTot.renderTotGaze = function(){
    noStroke();
    fill(0, 0, 200, 5);
    var theta = thisTot.velocity.heading() + radians(90);

    push();

    translate(thisTot.position.x,thisTot.position.y);

    rotate(theta);

    beginShape();

    vertex(0, -thisTot.size);
    vertex(-thisTot.size*2, -(thisTot.fieldRadius - thisTot.size));
    vertex(thisTot.size*2, -(thisTot.fieldRadius - thisTot.size));

    endShape();

    pop();
  }
  
  thisTot.renderIntersectShape = function(intersections, distance, otherHue, i, thisPushForce) {
    var circleNormal = createVector(thisTot.radius, 0),
        distIntA = createVector(intersections[0], intersections[1]),
        distIntB = createVector(intersections[2], intersections[3]),
        angle1, angle2, newHue, opacity;

    newHue = thisTot.averageHues(thisTot.personality, otherHue);

    if(thisPushForce <= 0){
      newHue = (newHue + thisTot.fieldPulseFrame)%255;
    }

    // if(thisPage == "Duet") {
    //   newHue = (newHue + thisTot.fieldPulseFrame)%255;
    // }


    if(globals.activeTotMode && thisTot.isActiveTot) {
      opacity = map(i, 0, thisTot.fieldSize, 0, 255);
      opacity = (255-opacity);
    } else {
      opacity = 200;
    }
        
    
    //Dots
    var dotSize = 2;
    noStroke();

    for (var i = dotSize; i > 0; i--){
      fill(newHue, 255, 250, 100);

      if(globals.activeTotMode && thisTot.isSelfTot) {
        ellipse(distIntA.x, distIntA.y, dotSize, dotSize);
        ellipse(distIntB.x, distIntB.y, dotSize, dotSize);
      }
    }
    //Arcs
    /*
    distIntA.sub(position);
    distIntB.sub(position);
    
    if(distance.x > 0){
      if(distIntA.y < distance.y){
        angle1 = getArcAngle(circleNormal, distIntA);
        angle2 = getArcAngle(circleNormal, distIntB);
      } else {
        angle1 = getArcAngle(circleNormal, distIntB);
        angle2 = getArcAngle(circleNormal, distIntA);
      }
      
      if((angle1 - PI) >  angle2){
        angle2 += TWO_PI;
      }
    } else {
      if(distIntA.y > distance.y){
        angle1 = getArcAngle(circleNormal, distIntA);
        angle2 = getArcAngle(circleNormal, distIntB);
      } else {
        angle1 = getArcAngle(circleNormal, distIntB);
        angle2 = getArcAngle(circleNormal, distIntA);
      }
      
      if((angle1 - PI) >  angle2){
        angle2 += TWO_PI;
      }
    }
    fill(100, 1);
    noStroke();
    arc(position.x, position.y, 2*tempSize, 2*tempSize, angle1, angle2, OPEN);
    */
  }

  thisTot.getHueGap = function(hue1, hue2) {
    var hueDifference, hueGap;
    hueDifference = Math.abs(hue1 - hue2);

    if(hueDifference > 128){
      hueGap = (255 - hueDifference)/2;
    } else {
      hueGap = hueDifference/2;
    }

    return hueGap;
  }

  thisTot.averageHues = function(hue1, hue2) {
    var baseHue, newHue, hueGap, hueDifference,
        maxHue = 255;
    hueDifference = Math.abs(hue1 - hue2);
    
    if(hueDifference > (maxHue/2)){
      if(hue1 > hue2) {
        baseHue = hue1;
      } else {
        baseHue = hue2;
      }

      hueGap = (maxHue - hueDifference)/2;
    } else {
      if(hue1 < hue2) {
        baseHue = hue1;
      } else {
        baseHue = hue2;
      }

      hueGap = hueDifference/2;
    }

    newHue = (baseHue + hueGap) % maxHue;
    return newHue;
  }
  
  thisTot.renderOverlapShape = function(shapeSize){
    noFill();
    strokeWeight(2);
    stroke(0, 0, 0);
    ellipse(thisTot.position.x, thisTot.position.y, 2*shapeSize, 2*shapeSize);
  }
  
  thisTot.renderField = function() {
    strokeWeight(3.5);
    noFill();
    for(var i = thisTot.fieldPulseFrame%thisTot.fieldIncrement; i < thisTot.fieldRadius; i+=thisTot.fieldIncrement){
      var opacity = map(i, 0, thisTot.fieldRadius, 30, 0);
      stroke(thisTot.personality, 200, 200, opacity);
      ellipse(thisTot.position.x, thisTot.position.y, 2*i, 2*i);
    }
  }
  
  thisTot.renderAura = function() {
    strokeWeight(3.5);
    noFill();
    for(var i = thisTot.fieldPulseFrame%thisTot.fieldIncrement; i < thisTot.fieldRadius/2; i+=thisTot.fieldIncrement){
      var opacity = map(i, 0, thisTot.fieldRadius/2, 10, 0);
      stroke(200, opacity);
      ellipse(thisTot.position.x, thisTot.position.y, 2*i, 2*i);
    }
  }

  thisTot.driveTot = function() {
    var driveForceMag,
        driveForceIncrement;

    if(thisPage == "Index") {
      driveForceIncrement = 0.02;
    } else {
      driveForceIncrement = 0.15;
    }

    if (keyIsDown(LEFT_ARROW))
      thisTot.driveForce.add(-1 * driveForceIncrement, 0);

    if (keyIsDown(RIGHT_ARROW))
      thisTot.driveForce.add(driveForceIncrement, 0);

    if (keyIsDown(UP_ARROW))
      thisTot.driveForce.add(0, -1 * driveForceIncrement);

    if (keyIsDown(DOWN_ARROW))
      thisTot.driveForce.add(0, driveForceIncrement);

    thisTot.forces.push(thisTot.driveForce);

    driveForceMag = thisTot.driveForce.mag();

    // this diminishes the drive force over time so the gas pedal doesn't get stuck
    if(driveForceMag > 0.01){
      thisTot.driveForce.mult(0.9);
    } else if(driveForceMag > 0){
      thisTot.driveForce.mult(0);
    }
  }

  thisTot.reset = function() {
    thisTot.acceleration.mult(0);
    if(thisTot.isSelfTot && globals.activeTotMode){
      thisTot.velocity.mult(0.99);
    } else if(thisTot.forces.length === 0) {
      thisTot.velocity.mult(0.9999);
    } else {
      thisTot.velocity.mult(0.9999);
    }
    thisTot.forces = [];
    thisTot.fieldPulseFrame += thisTot.fieldPulseRate;
  }
}