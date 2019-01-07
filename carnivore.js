//carnivore mutation rate constant
let cMC = 0.01;
function Carnivore(x, y, chromosome) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxhealth = 1;
    this.mass=2;
    this.age=1
    this.chromosome = [];
    if (chromosome === undefined) {
       //general "luck" of the animal estimated as numbers of skill points, amount of skill points animal has, translate to his chances for survival
        this.chromosome[0] = random(10, 20);
        // gene used for perception of Prey
        this.chromosome[1] = random(90, 100);
        // gene used for weight of prey
        this.chromosome[2] = random(-2, 2);
         // MaxSpeed gene
        this.chromosome[3]=random(1,6);
        //general "luck" of the animal estimated as numbers of skill points, amount of skill points animal has, translate to his chances for survival
        this.chromosome[4] = random(10, 20);
    } else {
        // mutating
        this.chromosome[0] = chromosome[0];
        this.chromosome[1] = chromosome[1];
        this.chromosome[2] = chromosome[2];
        this.chromosome[3]=chromosome[3];
        if (random(1) < cMC) {
            this.chromosome[0] += random(-1, 1);
        }
        if (random(1) < cMC) {
            this.chromosome[1] += random(-0.1, 0.1);
        }
        if (random(1) < cMC) {
            this.chromosome[2] += random(-0.1, 0.1);
        }
        if (random(1) < cMC) {
            this.chromosome[3] += random(-1, 1);
        }
        if (random(1) < cMC) {
            this.chromosome[4] += random(10, 20);
        }
    }
    //maxspeed depends on how much luck/skill points animal has
    this.maxspeed = this.chromosome[3]/1.5+(this.chromosome[0]/7);
    //maxforce depends on maxspeed variable
    this.maxforce =10-this.maxspeed;
    //the more lucky (skillpoints) animal is the more health points it has from the start
    this.health=Math.round(this.chromosome[0]/20);

    // updating location of the carnivore object
    this.update = function() {
        //var aux = this.chromosome[0] / 1000;
        //losing weight and health over time
        this.health -= 0.002;
        this.mass-=0.002;
        // updating velocity of the herbivore object
        this.velocity.add(this.acceleration);
        // limiting speed of the object
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // resetting acceleratione for each new cycle
        this.acceleration.mult(0);
         this.age=this.age+0.1;
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }

    this.clone = function() {
        if (random(1) < 0.001) {
            return new Carnivore(this.position.x, this.position.y, this.chromosome);
        } else {
            return null;
        }
    }

    this.behaviours = function() {
        var positiveSteer = this.eat(0.8, this.chromosome[1]);
        positiveSteer.mult(this.chromosome[2]);
        this.applyForce(positiveSteer);
    }
//    this.behaviours=function(positive, negative) {
//    var positiveSteer = this.eat(positive, 0.2, this.chromosome[2]);
//    var negativeSteer = this.eat(negative, -1, this.chromosome[3]);
//    var steerFollow=this.eat;
//      //applaying genetic traits
//    positiveSteer.mult(this.chromosome[0]);
//    negativeSteer.mult(this.chromosome[1]);
//    this.applyForce(positiveSteer);
//    this.applyForce(negativeSteer);
//  }


    this.eat = function(energyValue, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = herbivores.length - 1; i >= 0; i--) {

            var d = this.position.dist(herbivores[i].position);
            if (d < this.maxspeed) {
                herbivores.splice(i, 1);
                if (this.health < this.maxhealth) {
                    this.health += energyValue;
                    this.mass+=5;
                }
            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = herbivores[i].position;
                }
            }
        }

        if (closest != null) {
            return this.seek(closest);
        }

        return createVector(0, 0);
    }

    // A method based on Craig Reynolds idea calculating a steering force in direction to a target(STEER = DESIRED-VELOCITY)
    this.seek = function(target) {

        var desired = p5.Vector.sub(target, this.position); // This vector points from the current location to the position of the target

        // Scaling to maxSpeed
        desired.setMag(this.maxspeed);

        // Steer = Desired - velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); //  Limiting to maxforce

        return steer;
        //this.applyForce(steer);
    }

    this.dead = function() {
        return (this.health < 0)
    }

    this.display = function() {
        // painting a shape of the same direction as velocity
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

        var gr = color(0, 0, 255);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);

        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
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
