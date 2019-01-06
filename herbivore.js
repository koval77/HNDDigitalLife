//hMC-herbivore mutation probablity factor
let hMC = 0.01;
class Herbivore{
    constructor(x,y,chromosome){
  this.position = createVector(x, y);this.velocity = createVector(0, -1);this.acceleration = createVector(0, 0);
        //size
  this.r = 5;
        //mass, the heavier the object to more difficult is to steer it
this.mass=0.3;this.age=1;this.chromosome = [];
  if (chromosome === undefined) {
    // Food weight
    this.chromosome[0] = random(-2, 2);
    // Poison weight
    this.chromosome[1] = random(-2, 2);
    // Food perception
    this.chromosome[2] = random(0, 100);
    // Poison Perception
    this.chromosome[3] = random(0, 100);
      //general "luck" of the animal estimated as numbers of skill points, amount of skill points animal has, translate to his chances for survival
        this.chromosome[4] = random(10, 20);
      //chromosome for maxspeed
      this.chromosome[5]=random(-2,6);
      //affectin rate of hunger
      this.chromosome[6]=0.001*random(1,4);
  } else {
    // Mutation
    this.chromosome[0] = chromosome[0];if (random(1) < hMC) {this.chromosome[0] += random(-0.1, 0.1);}
    this.chromosome[1] = chromosome[1];if (random(1) < hMC) {this.chromosome[1] += random(-0.1, 0.1);}
    this.chromosome[2] = chromosome[2];if (random(1) < hMC) {this.chromosome[2] += random(-10, 10);}
    this.chromosome[3] = chromosome[3];if (random(1) < hMC) {this.chromosome[3] += random(-10, 10);}
       this.chromosome[4] = chromosome[4];if (random(1) < hMC) {this.chromosome[4] += random(-2, 2);}
       this.chromosome[5] = chromosome[5];if (random(1) < hMC) {this.chromosome[5] += random(-2, 2);}
       this.chromosome[6] = chromosome[6];if (random(1) < hMC) {this.chromosome[6] = 0.001*random(1,3);}}
     //maxspeed depends on how much luck/skill points animal has
    this.maxspeed = this.chromosome[5]/1.5+(this.chromosome[4]/7);
    //maxforce depends on maxspeed variable
    this.maxforce =10-this.maxspeed;
    //the more lucky (skillpoints) animal is the more health points it has from the start
    this.health=Math.round(this.chromosome[4]/20);
    }

 // updating location of the herbivore object
  update() {
      //losing weight and health over time
      this.mass-=0.002;
   this.health -= 0.003;
      //*this.chromosome[6];
    // updating velocity of the herbivore object
    this.velocity.add(this.acceleration);
    // limiting speed of the object
    this.velocity.limit(this.maxspeed);
      //updating position of the object
    this.position.add(this.velocity);
      this.position.x = constrain(this.position.x, 0, width);
    this.position.y = constrain(this.position.y, 0, height);
    // resetting acceleratione for each new cycle
    this.acceleration.mult(0);
      //incrementing age
      this.age=this.age+0.01;
  }
    //If animal is healthy and lucky it is being cloned
    clone() {
    if (random(1) < 0.002&&this.health>0.3) {
      return new Herbivore(this.position.x, this.position.y, this.chromosome);
    } else {
      return null;
    }
  }

  applyForce(force) {
      console.log("force is: "+force);
      // includind mass in calculations(a = f/m => f = a*m)
     force.div(this.mass);
    this.acceleration.add(force);
  }
  behaviours(positive, negative) {
    var positiveSteer = this.eat(positive, 0.2, this.chromosome[2]);
    var negativeSteer = this.eat(negative, -1, this.chromosome[3]);
    var steerFollow=this.eat;
      //applaying genetic traits
    positiveSteer.mult(this.chromosome[0]);
    negativeSteer.mult(this.chromosome[1]);
    this.applyForce(positiveSteer);
    this.applyForce(negativeSteer);
  }
  eat(aims, energyValue, perception) {
    var record = Infinity;//infinity is keyword from javascript.
    var closest = null;
    for (var i = aims.length - 1; i >= 0; i--) {
      var d = this.position.dist(aims[i]);//checking what distance is the smallest from aims list.
      if (d < this.maxspeed) {//checking if aim is reached
        aims.splice(i, 1);//removing aim from the loop
        this.health += energyValue;//
          this.mass+=5;
      } else if(d < record && d < perception){//taking perception trait into account
       {
          record = d;
          closest = aims[i];//finding closest aim
        }
      }
    }
    //  eating
    if (closest != null) {
      return this.seek(closest);
    }
    return createVector(0, 0);
  }
  // A method based on Craig Reynolds idea calculating a steering force in direction to a target(STEER = DESIRED-VELOCITY)
  seek(target) {
    var desired = p5.Vector.sub(target, this.position); // This vector points from the current location to the position of the target
console.log("desired before setmag: "+desired);
    // Scaling to maxSpeed
    desired.setMag(this.maxspeed);
      console.log("desired after setmag"+desired);
    // Steer = Desired - velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limiting to maxforce
    return steer;
  }
    //slightly different seek variant to taunt herbivores
     seek2(target) {
    var desired = p5.Vector.sub(target, this.position); // This vector points from the current location to the position of the target
console.log("desired before setmag: "+desired);
    // Scaling to maxSpeed
    desired.setMag(this.maxspeed);
      console.log("desired after setmag"+desired);
    // Steer = Desired - velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limiting to maxforce
    this.applyForce(steer);
  }
//  ageing(){
//      this.age=this.age+0.0005;
//  }
  dead() {
    return (this.health < 0)
  }

  display() {
    // painting a shape of the same direction as velocity
    var angle = this.velocity.heading() + PI / 2;
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);
    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    ellipse(10,this.r,15,this.age);
    vertex(5, -this.age * 2);
    vertex(-this.age, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
    //if animal is going out of the screen revers its velocity
boundariesv2(){
    if ((this.position.x > width-5) || (this.position.x < 5)) {
    this.velocity.x =this.velocity.x*(-1);
  }
    if ((this.position.y > (height-5)) || (this.position.y < 5)) {
    this.velocity.y =this.velocity.y*(-1);
  }
}
}//class Herbivore ends
