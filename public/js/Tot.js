//Tot
function Tot(totOptions) {

  //Internal Properties
  var totView = this;

  totView.options = {
    'isSelfTot': totOptions.isSelfTot || false,
    'personality': totOptions.personality || 125,
    'confidence': totOptions.confidence || 125,
    'sensitivity': totOptions.sensitivity || 125,
    'sociability': totOptions.sociability || 125,
    'runInterference': true,
    'runTot': true,
    'displayTot': true,
    'displayTotGaze': true,
    'activeTotMode': false,
    'wallMode': 'passThrough',
    'socialMode': 'pairing',
    'diversityValue': false
  };

  var doRunInterference = true,
      activeTotMode,
      isPassThrough,
      isPairing,
      diversityValue,
      fieldPulseRate = 1,
      size = 12,
      hue = totOptions.personality || Math.floor(Math.random() * 256),
      fieldPulseFrame = 0,
      pushForce,
      driveForce = createVector(0, 0),
      radius = size/2,
      tempXPos = Math.floor(Math.random() * (width-size) + size/2),
      tempYPos = Math.floor(Math.random() * (height-size) + size/2),
      previousTotOptions = {};

  totView.isActiveTot = false;
  totView.size = size;
  totView.radius = radius;
  totView.hue = hue;
  totView.fieldRings = Math.floor(Math.random() * 20 + 5);
  totView.position = createVector(tempXPos, tempYPos);
  totView.velocity = p5.Vector.random2D().mult(4);
  totView.acceleration = createVector(0, 0);
  totView.forces = [];

  
  //totView.run(bills)
  //This is the function that runs every draw cycle. Controls
  //basic operation of the tot's various components
  totView.run = function(bills, totRunOptions) {
    totView.setVariables(totRunOptions);
    totView.update(bills);
    totView.display();
    totView.reset();
  }

  totView.setVariables = function(totRunOptions) {
    pushForce = totRunOptions.forceValue;
    activeTotMode = totRunOptions.activeTotMode;
    isPassThrough = totRunOptions.isPassThrough;
    isPairing = totRunOptions.isPairing;
    diversityValue = totRunOptions.diversityValue;
    
    totView.fieldSize = totRunOptions.fieldSize;
    totView.fieldRadius = totView.fieldSize/2;
    totView.fieldIncrement = totView.fieldRadius/totView.fieldRings;
    totView.fieldIncrementMultiplier = Math.random() * 2 + 1;

    if(activeTotMode) {
      fieldPulseRate = 0.5;
    } else {
      fieldPulseRate = 0;
      totView.isActiveTot = false;
    }
  }
  
  //totView.update()
  //Updates the position vectors of the Tot, no params
  totView.update = function(bills) {

    if(doRunInterference) {
      bills.forEach(totView.runInterference, this);
    }

    if(totView.isActiveTot) {
      totView.driveTot();
    }

    for(var i = 0; i < totView.forces.length; i++) {
      totView.acceleration.add(totView.forces[i].x, totView.forces[i].y);
    }

    totView.velocity.add(totView.acceleration.x, totView.acceleration.y);
    totView.velocity.limit(7);
    totView.position.add(totView.velocity.x, totView.velocity.y);
    if(isPassThrough === 1){
      totView.passThrough();
    } else {
      totView.checkForWalls();
    }
  }

  totView.checkForWalls = function() {
    if((totView.position.x - radius) <= 0){  
      totView.position.x = radius;
      if(totView.velocity.x < 0){
        totView.velocity.x *= -1; 
      }
    }
    if((totView.position.x + radius) >= width){  
      totView.position.x = width - radius; 
      if(totView.velocity.x > 0){
        totView.velocity.x *= -1; 
      }
    }
    if((totView.position.y - radius) <= 0){ 
      totView.position.y = radius; 
      if(totView.velocity.y < 0){
        totView.velocity.y *= -1; 
      }
    }
    if((totView.position.y + radius) >= height){ 
      totView.position.y = height - radius; 
      if(totView.velocity.y > 0){
        totView.velocity.y *= -1; 
      }
    }
  }

  totView.passThrough = function() {
    if((totView.position.x + radius) <= 0){  
      totView.position.x = width;
    }
    if((totView.position.x - radius) >= width){  
      totView.position.x = 0 - radius;
    }
    if((totView.position.y + radius) <= 0){ 
      totView.position.y = height;
    }
    if((totView.position.y - radius) >= height){ 
      totView.position.y = 0 - radius;
    }
  }

  totView.addForce = function(force, index, forces) {
    totView.acceleration.add(force.x, force.y);
  }
  
  //totView.display()
  //Runs the functions that create the visual appearance of the Tot, no params
  totView.display = function() {
    // if(activeTotMode && totView.isActiveTot){
    //   totView.renderField();
    // }
    if(totView.options.displayTot){
      totView.renderTot();
    }
    if(totView.options.displayTotGaze){
      totView.renderTotGaze();
    }
  }
  
  totView.runInterference = function(bill, index, bills) {
  	var thisTot = totView,
  		  otherTot = bill,
        distance = p5.Vector.dist(thisTot.position, otherTot.position),
        dVector = p5.Vector.sub(otherTot.position, thisTot.position),
        dNormal = dVector.normalize(),
        thisRing,
        thatRing;

    fieldPulseFrame = fieldPulseFrame % totView.fieldIncrement;
    
    //if otherTot is not thisTot
    if(distance > 0) {

      //for each ring of thisTot's field
      for(var thisRing = fieldPulseFrame; thisRing < thisTot.fieldRadius; thisRing+=thisTot.fieldIncrement) {
        //for each ring of otherTot's field
        for(var thatRing = fieldPulseFrame; thatRing < otherTot.fieldRadius; thatRing+=otherTot.fieldIncrement) {
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
                  pushForce,
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
              pushForce = totView.calculatePushForce(thisTot, otherTot, distance, thisRing, thatRing);

              pushVector1 = p5.Vector.sub(thisTot.position, firstIntersectionPoint)
                .normalize()
                .mult(pushForce);

              pushVector2 = p5.Vector.sub(thisTot.position, secondIntersectionPoint)
                .normalize()
                .mult(pushForce);

              totView.forces.push(pushVector1);
              totView.forces.push(pushVector2);


              // Render the intersection shape if you'd like to

              // The intersection shape renders if it is not active tot mode, 
              // if it is and this is the active tot, or if this is the self tot

              // if(totView.isActiveTot) {
              if(!activeTotMode || (activeTotMode && totView.isActiveTot) || totView.options.isSelfTot) {
                totView.renderIntersectShape(intersections, distance, otherTot.hue, thisRing);
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

  totView.calculatePushForce = function(thisTot, otherTot, distance, thisRing, thatRing) {
    var hueDifference,
        pushForce;


    // hueGap returns the value that is half the distance between thisHue and otherTot.hue
    // Value will be 0 - 63.75

    hueDifference = totView.getHueGap(thisTot.hue, otherTot.hue);


    //pushForce will be 0.68 to -0.313
    if(isPairing) {
      pushForce = (43.75 - hueDifference)/63.75;
    } else {
      pushForce = (hueDifference - 20)/63.75;
    }
      

    var diversityFactor = map(diversityValue, 0, 255, 0, 1);

    // Adjust the pushForce by the amount that everyone is expressing
    pushForce *= diversityFactor;

    // Adjust the push force according to which field rings the force is
    // coming from, a higher force for a closer ring
    pushForce = pushForce / (thisRing * thatRing);

    // Adjust pushForce by global push strength variable
    pushForce *= 800;

    return pushForce;
  }
  
  totView.renderTot = function() {
    noStroke();

    if(totView.isActiveTot) {
      strokeWeight(4);
      stroke(0, 0, 255, 100);
    }

    fill(hue, diversityValue, 200);

    var theta = totView.velocity.heading() + radians(90);

    ellipse(totView.position.x, totView.position.y, size, size);

    // push();

    // translate(totView.position.x,totView.position.y);

    // rotate(theta);

    // beginShape();

    // vertex(0, -size*2);
    // vertex(-size, size*2);
    // vertex(0, size);
    // vertex(size, size*2);

    // endShape();

    // pop();
  }

  totView.renderTotGaze = function(){
    noStroke();
    fill(0, 0, 200, 5);
    var theta = totView.velocity.heading() + radians(90);

    push();

    translate(totView.position.x,totView.position.y);

    rotate(theta);

    beginShape();

    vertex(0, -size);
    vertex(-size*2, -(totView.fieldRadius - size));
    vertex(size*2, -(totView.fieldRadius - size));

    endShape();

    pop();
  }
  
  totView.renderIntersectShape = function(intersections, distance, otherHue, i) {
    var circleNormal = createVector(radius, 0),
        distIntA = createVector(intersections[0], intersections[1]),
        distIntB = createVector(intersections[2], intersections[3]),
        angle1, angle2, newHue, opacity;

    newHue = totView.averageHues(totView.hue, otherHue);

    if(activeTotMode && totView.isActiveTot) {
      opacity = map(i, 0, totView.fieldSize, 0, 255);
      opacity = (255-opacity);
    } else {
      opacity = 200;
    }
        
    
    //Dots
    var dotSize = 2;
    noStroke();

    for (var i = dotSize; i > 0; i--){
      fill(newHue, diversityValue, 200, (opacity/3));
      ellipse(distIntA.x, distIntA.y, dotSize, dotSize);
      if(activeTotMode && totView.isActiveTot) {
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

  totView.getHueGap = function(hue1, hue2) {
    var hueDifference, hueGap;
    hueDifference = Math.abs(hue1 - hue2);

    if(hueDifference > 128){
      hueGap = (255 - hueDifference)/2;
    } else {
      hueGap = hueDifference/2;
    }

    return hueGap;
  }

  totView.averageHues = function(hue1, hue2) {
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
  
  totView.renderOverlapShape = function(shapeSize){
    noFill();
    strokeWeight(2);
    stroke(0, 0, 0);
    ellipse(totView.position.x, totView.position.y, 2*shapeSize, 2*shapeSize);
  }
  
  totView.renderField = function() {
    strokeWeight(1);
    noFill();
    for(var i = fieldPulseFrame; i < totView.fieldRadius; i+=totView.fieldIncrement){
      var opacity = map(i, 0, totView.fieldRadius, 255, 0);
      stroke(hue, 200, 200, opacity);
      ellipse(totView.position.x, totView.position.y, 2*i, 2*i);
    }
  }

  totView.driveTot = function() {
    var driveForceMag,
        driveForceIncrement = 0.1;

    if (keyIsDown(LEFT_ARROW))
      driveForce.add(-1 * driveForceIncrement, 0);

    if (keyIsDown(RIGHT_ARROW))
      driveForce.add(driveForceIncrement, 0);

    if (keyIsDown(UP_ARROW))
      driveForce.add(0, -1 * driveForceIncrement);

    if (keyIsDown(DOWN_ARROW))
      driveForce.add(0, driveForceIncrement);

    totView.forces.push(driveForce);

    driveForceMag = driveForce.mag();

    
    if(driveForceMag > 0.01){
      driveForce.mult(0.9);
    } else if(driveForceMag > 0){
      driveForce.mult(0);
    }
  }

  totView.reset = function() {
    totView.acceleration.mult(0);
    if(totView.isActiveTot){
      totView.velocity.mult(0.99);
    } else if(totView.forces.length === 0) {
      totView.velocity.mult(0.9999);
    } else {
      totView.velocity.mult(0.9999);
    }
    totView.forces = [];
    fieldPulseFrame += fieldPulseRate;
  }
}