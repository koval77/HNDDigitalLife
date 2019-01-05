var taunter;
var [herbivores,food,poison,carnivores]=[[],[],[],[]]
var [choice,xl,yl]=[0,0,0]
function setup() {

    //variable for St Patrick's logo
    img=createImg("stplogo.png");
    //Creating variable for canvas
     var myCanvas = createCanvas(1200, 720);
    //positioning logo
    img.position(1020, 0);
  img.size(200, 150);
//  myCanvas.parent('myHNDProject');
//  createCanvas(1200, 720);
//    greeting = createElement('h2', 'HERBIVORES ALIVES:'+herbivores.length);
//  greeting.position(20, 5);
      button = createButton('Create Herbivore');
  button.mousePressed(togH);
    button = createButton('Create Carnivore');
  button.mousePressed(togC);
        button = createButton('Taunt Herbivores');
  button.mousePressed(togT);
  for (var i = 0; i < 50; i++) {
    var x = random(width);
    var y = random(height);
    herbivores[i] = new Herbivore(x, y);
  }

  for (var i = 0; i < 40; i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

     for (var i = 0; i < 6; i++) {
        var x = random(width);
        var y = random(height);
        carnivores[i] = new Carnivore(x, y);
    }

  for (var i = 0; i < 20; i++) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }
  debug = createCheckbox();
// creating greeting variable to hold text displaying how many herbivores are alive
greeting = createElement('h2', 'HERBIVORES ALIVE:  '+herbivores.length);
//giving id to the variable
greeting.id('hl');
greeting = createElement('h2', 'Carnivores alive:  '+carnivores.length);
//giving id to the variable
greeting.id('cl');
}

function mouseDragged() {if (choice==1){
  herbivores.push(new Herbivore(mouseX, mouseY));}
                         else if(choice==2){carnivores.push(new Carnivore(mouseX, mouseY));}

}
function draw() {
  background(51);
    //declaring variable "where". i will use it late to reference a "decoy point" towards all herbivores will be going
    var where=createVector(mouseX,mouseY);
//    displaying amount of herbivores using plan, "vanilla" javascript
    document.getElementById("hl").innerHTML = "Herbivores alive: "+herbivores.length;
//  greeting.position(1200, 5);
    //    displaying amount of carnivores using javascript
    document.getElementById("cl").innerHTML = "\nCarnivores alive: "+carnivores.length;
    if (choice==3){  // lerp() calculates a number between two numbers at a specific increment.
  // The amt parameter is the amount to interpolate between the two values
  // where 0.0 equal to the first point, 0.1 is very near the first point, 0.5
  // is half-way in between, etc.

  // Here we are moving 5% of the way to the mouse location each frame
  xl = lerp(xl, mouseX, 0.05);
  yl = lerp(yl, mouseY, 0.05);

  fill(255);
  stroke(255);
  ellipse(xl, yl, 66, 66);
          //  poison.push(createVector(mouseX, mouseY));
        herbivores.forEach(pro);
    }

  if (random(1) < 0.1) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  if (random(1) < 0.001) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }


  for (var i = 0; i < food.length; i++) {
//    fill(0, 255, 0);
//    noStroke();
//      noFill();
//    stroke(2,255,134);
//    strokeWeight(1);
    beginShape();
         stroke(112,255,134);
    strokeWeight(1);
      fill(2,255,134);
    ellipse(food[i].x+10,food[i].y,5,10);
      ellipse(food[i].x+15,food[i].y,5,10);
      noFill();
      arc(food[i].x+32,food[i].y+5, 40, 50, PI, PI + QUARTER_PI);
//    vertex(5, -this.r * 2);
//    vertex(-this.r, this.r * 2);
//    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    //ellipse(food[i].x, food[i].y, 4, 4);
  }

  for (var i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8, 8);
  }

  for (var i = herbivores.length - 1; i >= 0; i--) {
    herbivores[i].boundaries();
//      herbivores[i].ageing();
      //when user clicks "Taunt Herbivores" button all herbivores will navigate to "where" vector
      if (choice==3){herbivores[i].seek2(where);
    herbivores[i].update();
    herbivores[i].display();
                    }
      if(choice!==3){
    herbivores[i].behaviours(food, poison);
    herbivores[i].update();
    herbivores[i].display();}

    var newHerbivore = herbivores[i].clone();
    if (newHerbivore != null) {
      herbivores.push(newHerbivore);
        console.log("sketch142, new herbivore is being cloned");
    }

    if (herbivores[i].dead()) {
      var x = herbivores[i].position.x;
      var y = herbivores[i].position.y;
      food.push(createVector(x, y));
      herbivores.splice(i, 1);
    }
  }
 for (var i = carnivores.length - 1; i >= 0; i--) {
        carnivores[i].boundaries();
        carnivores[i].behaviours();
        carnivores[i].update();
        carnivores[i].display();
        console.log(carnivores.length);
        var newCarnivore = carnivores[i].clone();
        if (newCarnivore != null) {
            carnivores.push(newCarnivore);
        }
        if (carnivores[i].dead()) {
            var x = carnivores[i].position.x;
            var y = carnivores[i].position.y;
            carnivores.splice(i, 1);
        }
    }
}
function togH(){
    choice=1;}
function togC(){
    choice=2;}
function togT(){
    choice=3;}
function pro(v,i,a){
    console.log("Inside pro function");}
