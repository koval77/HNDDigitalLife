let hMC = 0.01;

function Herbivore(x, y, chromosome) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 2;
  this.maxforce = 0.5;

  this.health = 2;

  this.chromosome = [];
  if (chromosome === undefined) {
    // Food weight
    this.chromosome[0] = random(-2, 2);
    // Poison weight
    this.chromosome[1] = random(-2, 2);
    // Food perception
    this.chromosome[2] = random(0, 100);
    // Poison Perception
    this.chromosome[3] = random(0, 100);
  } else {
    // Mutation
    this.chromosome[0] = chromosome[0];
    if (random(1) < hMC) {
      this.chromosome[0] += random(-0.1, 0.1);
    }
    this.chromosome[1] = chromosome[1];
    if (random(1) < hMC) {
      this.chromosome[1] += random(-0.1, 0.1);
    }
    this.chromosome[2] = chromosome[2];
    if (random(1) < hMC) {
      this.chromosome[2] += random(-10, 10);
    }
    this.chromosome[3] = chromosome[3];
    if (random(1) < hMC) {
      this.chromosome[3] += random(-10, 10);
    }
  }

  // Method to update location
  this.update = function() {

    this.health -= 0.005;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  this.behaviours = function(positive, negative) {
    var positiveSteer = this.eat(positive, 0.2, this.chromosome[2]);
    var negativeSteer = this.eat(negative, -1, this.chromosome[3]);
      var steerFollow=this.eat

    positiveSteer.mult(this.chromosome[0]);
    negativeSteer.mult(this.chromosome[1]);

    this.applyForce(positiveSteer);
    this.applyForce(negativeSteer);
  }

  this.clone = function() {
    if (random(1) < 0.002) {
      return new Herbivore(this.position.x, this.position.y, this.chromosome);
    } else {
      return null;
    }
  }

  this.eat = function(list, energyValue, perception) {
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += energyValue;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {

    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  }

  this.dead = function() {
    return (this.health < 0)
  }

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);


    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.chromosome[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.chromosome[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.chromosome[1] * 25);
      ellipse(0, 0, this.chromosome[3] * 2);
    }

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);


    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    ellipse(10,this.r,15,5);
    vertex(5, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  }


  this.boundaries = function() {
    var d = 25;

    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
}
