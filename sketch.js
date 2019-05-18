//declaring arrays for populations
var [herbivores,food,poison,carnivores]=[[],[],[],[]]
//declaring variables for UI functions
var [choice,xl,yl]=[0,0,0]

function setup() {
//var cnv = createCanvas(windowWidth, windowHeight);
//  cnv.style('display', 'block');
    //variable for St Patrick's logo
//    img=createImg("stplogo.png");
    //Creating variable for canvas
     var myCanvas = createCanvas(1200, 720);
    myCanvas.style('display','block');
    //positioning logo
//    img.position(1020, 0);img.size(200, 150);
    //creating buttons and linking them with functions
      button = createButton('Create Herbivore');button.mousePressed(togH);
    button = createButton('Create Carnivore');button.mousePressed(togC);
    button = createButton('Create Poison');button.mousePressed(togP);
        button = createButton('Taunt Herbivores');button.mousePressed(togT);
    //populating arrays
  for (var i = 0; i < 50; i++) {var x = random(width);var y = random(height);herbivores[i] = new Herbivore(x, y);}
  for (var i = 0; i < 40; i++) {var x = random(width);var y = random(height);food.push(createVector(x, y));}
     for (var i = 0; i < 6; i++) {var x = random(width);var y = random(height);carnivores[i] = new Carnivore(x, y);}
  for (var i = 0; i < 20; i++) {var x = random(width);var y = random(height);poison.push(createVector(x, y));}
  debug = createCheckbox();
// creating greeting variable to hold text displaying how many herbivores are alive
greeting = createElement('h2', 'HERBIVORES ALIVE:  '+herbivores.length);
//giving id to the variable
greeting.id('hl');
greeting = createElement('h2', 'CARNIVORES ALIVE:  '+carnivores.length);
//giving id to the variable
greeting.id('cl');}
//function for buttons, aftfer clicking them the the mouse cursor will create different things on the screen
function mouseDragged() {if (choice==1){
  herbivores.push(new Herbivore(mouseX, mouseY));}
                         else if(choice==2){carnivores.push(new Carnivore(mouseX, mouseY));}
                         else if(choice==4){poison.push(createVector(mouseX,mouseY));}}
function draw() {
  background(10,12,60);
       fill(255, 100);
    text("Herbivores alive: "+herbivores.length , 10, 15);
     fill(255, 100);
    text("Carnivores alive: "+carnivores.length , 10, 30);
    //declaring variable "where". i will use it late to reference a "decoy point" towards all herbivores will be going
    var where=createVector(mouseX,mouseY);
//    displaying amount of herbivores using plan, "vanilla" javascript
    document.getElementById("hl").innerHTML = "Herbivores alive: "+herbivores.length;
    //    displaying amount of carnivores using javascript
    document.getElementById("cl").innerHTML = "\nCarnivores alive: "+carnivores.length;
    if (choice==3){  // lerp() calculates a number between two numbers at a specific increment.
  // The amt parameter is the amount to interpolate between the two values
  // where 0.0 equal to the first point, 0.1 is very near the first point, 0.5
  // is half-way in between, etc.
  // Here we are moving 5% of the way to the mouse location each frame
  xl = lerp(xl, mouseX, 0.05);
  yl = lerp(yl, mouseY, 0.05);
  fill(255);stroke(255);ellipse(xl, yl, 66, 66);
        herbivores.forEach(pro);}
    //generating food
  if (random(1) < 0.1) {var x = random(10,width-10);var y = random(10,height-10);food.push(createVector(x, y));}
  if (random(1) < 0.001) {var x = random(width);var y = random(height);poison.push(createVector(x, y));}
  for (var i = 0; i < food.length; i++) {
      //drawing food shape.
    beginShape();
         stroke(112,255,134);
    strokeWeight(1);
      fill(2,255,134);
    ellipse(food[i].x+10,food[i].y,5,10);
      ellipse(food[i].x+15,food[i].y,5,10);
      noFill();
      arc(food[i].x+32,food[i].y+5, 40, 50, PI, PI + QUARTER_PI);
    endShape(CLOSE);
  }
  for (var i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
      beginShape();
    ellipse(poison[i].x, poison[i].y, 6, 6);
      fill(255,50,150);
      ellipse(poison[i].x,poison[i].y,20,3);
      ellipse(poison[i].x,poison[i].y,3,20);
      endShape(CLOSE);
      noFill();
  }
  for (var i = herbivores.length - 1; i >= 0; i--) {
    herbivores[i].boundariesv2();
//      herbivores[i].ageing();
      //when user clicks "Taunt Herbivores" button all herbivores will navigate to "where" vector
      if (choice==3){herbivores[i].seek2(where);
    herbivores[i].update();
    herbivores[i].display();}
      if(choice!==3){
          herbivores[i].boundariesv2();
    herbivores[i].behaviours(food, poison);
    herbivores[i].update();
    herbivores[i].display();}
      herbivores[i].checkForPredators();
      herbivores[i].boundariesv2();
    var newHerbivore = herbivores[i].clone();
    if (newHerbivore != null) {
      herbivores.push(newHerbivore);
        console.log("sketch142, new herbivore is being cloned here!");
    }
    if (herbivores[i].dead()) {
      var x = herbivores[i].position.x;
      var y = herbivores[i].position.y;
        //cannibalism function
//      food.push(createVector(x, y));
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
function togP(){
    choice=4;}
function pro(v,i,a){
    console.log("Inside pro function");}
