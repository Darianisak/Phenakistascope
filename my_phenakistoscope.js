//  Written by Darian Culver for DSDN142 Project 2, Tri3 2020 Academic year
new p5(); //  Allows color vars

let sliceCount = 12; //  Used so that arcs can be safely drawn later in the code

function setup_pScope(pScope) {
  pScope.output_mode(ANIMATED_DISK);
  pScope.scale_for_screen(false);
  pScope.draw_layer_boundaries(false);
  pScope.draw_slits(false);
  pScope.set_direction(CCW);
  pScope.set_slice_count(sliceCount);
  frameRate(12);

  //  Image Loading
  pScope.load_image("EarthFrame_0", "png");
  pScope.load_image_sequence("Earth_Anim", "png", 12)
}

//  <----- Global Variables ----->
//  Background star variables
let starCol = color(255, 255, 255); //  Background star color
let starDiam = 10; //  Sets radius of stars
let starCount = 8;  //  Sets the amount of stars present in the image - MUST BE AS BIG OR SMALLER THAN STARX AND STARY
let starX = [-10,   25,   5,   -220,  235,  13,   -200, 190]; //  Array of star X coords
let starY = [-240, -260, -490, -625, -625,  -745, -770, -865];  //  Array of star Y coords

//  Earth Variables
let earthDiam = 120;

//  Moon variables
let moonDiam = 30 //  https://www.space.com/18135-how-big-is-the-moon.html

//  <-----  Draw loop ----->

//  Ring is the default mode for layers, hence why no mode is specified typically.
function setup_layers(pScope) {
  new PLayer(null, 0);

  //  Background setup - five layers
  let background1 = new PLayer(doFirst);
  background1.set_boundary(0, 200);

  let background2 = new PLayer(doSecond);
  background2.set_boundary(200, 400);

  let background3 = new PLayer(doThird);
  background3.set_boundary(400, 600);

  let background4 = new PLayer(doFourth);
  background4.set_boundary(600, 800);

  let background5 = new PLayer(doFifth);
  background5.set_boundary(800, 1000);

  //  Non Background functions

  let starSystem = new PLayer(doStars); //  Function that draws stars behind all other elements, adding depth to the image
  starSystem.set_boundary(0, 1000);

  let sunOuter = new PLayer(doOuterLayer);  //  Draws the outer ring of the star body
  sunOuter.set_boundary(125, 175);

  let sunTendrils = new PLayer(doSunTendrils);  //  Draws the suns tendril elements
  sunTendrils.set_boundary(100, 200);

  let sunInner = new PLayer(doInnerLayer);  //  Draws the core of the sun
  sunInner.set_boundary(0, 125);

  let earthMain = new PLayer(doEarthMain);  //  Draws main earth layer
  earthMain.set_boundary(400, 800);

  let moonMain = new PLayer(doMoonMain);  //  Draws moon layers
  moonMain.set_boundary(300, 900);
}
//  <-----  Main Functions  ----->

/*
  The doStars() function handles the drawing of all background stars within the image
  This is done by drawing predefined coordinate values from the arrays starX and starY
  The amount of these stars expressed can be adjusted via starCount, but it is essential
  starCount does not exceed the amount of coordinate pairs, otherwise an exception will be thrown.

  While the error checking does not check for null pointers, it does prevent off by ones.
  For the actual drawing of stars, the function makes a call to the generateStar() function, which
  creates each individual star
*/

function doStars(x, y, animation, pScope) {
  //  Error checking that prevents off by one errors occuring
  if (starX.length != starY.length) {
    throw 'Array Length in relation to starCount will cause an off by one!';
  } else {
    if (starX.length < starCount) {
      throw 'Star Count cannot be greater than the coordinate arrays!';
    }
  }
  for (let i = 0 ; i < starCount ; i++) { //  Generates stars
    generateStar(starX[i], starY[i], animation, pScope);
  }
}

/*
  Functions to draw the entirety of the sun
*/

function doOuterLayer(x, y, animation, pScope) {
  pScope.fill_background(255, 145, 50, 204);
}

function doSunTendrils(x, y, animation, pScope)  {
  //  This push() pop() segment manipulates the main tendril
  push();
  fill(240, 150, 70, 255 * animation.frame + 50);
  noStroke();
  beginShape(); //  Draws Main tendril
  vertex(0, -275);
  vertex(42, -100);
  vertex(0, -80);
  vertex(-42, -100);
  endShape();
  pop();

  //  Draws supporting tendrils that don't change shape
  fill(240, 150, 70, 200);
  noStroke();

  beginShape();
  vertex(50, -225);
  vertex(50, -120);
  vertex(30, -80);
  vertex(-10, -100);
  endShape();

  beginShape();
  vertex(-50, -225);
  vertex(-50, -120);
  vertex(30, -80);
  vertex(10, -100);
  endShape();
}

function doInnerLayer(x, y, animation, pScope)  {
  pScope.fill_background(255, 145, 50, 255);
}

/*
  doEarthMain() handles the main aspects of the Earth - Boundary 400px - 800px
*/
function doEarthMain(x, y, animation, pScope) {
  push();
  translate(0, -700)
  angleMode(DEGREES);
  rotate(360 * animation.frame);  //  Spins the earth in place
  fill(255);
  ellipse(0, 0, earthDiam, earthDiam);
  pScope.draw_image_from_sequence("Earth_Anim", 0 ,0, animation.frame)
  pop();
}

/*
  doMoonMain() draws the moon to screen, which orbits around the Earth, impacting
  colors displayed on the earth
*/

function doMoonMain(x, y, animation, pScope)  {
  push();
  translate(0, -700); //  Translated to the earths centre point
  angleMode(DEGREES);
  rotate(360 * animation.frame);  //  Rotate around earth
  fill(255*animation.frame);
  ellipse(0, 175, moonDiam, moonDiam);
  pop();
}

//  <-----  Helper Functions  ----->

/*
  The following five functions define the entirety of background colour for the image
  This isn't the way I wanted to implement this, but I guess it'll have to do.
  The Opacity staggers off at an even rate which helps to give the image a cleaner aesthetic
*/

function doFirst(x, y, animation, pScope) {
  pScope.fill_background(50, 50, 50, 255);
}

function doSecond(x, y, animation, pScope) {
  pScope.fill_background(50, 50, 50, 204);
}

function doThird(x, y, animation, pScope) {
  pScope.fill_background(50, 50, 50, 153);
}

function doFourth(x, y, animation, pScope) {
  pScope.fill_background(50, 50, 50, 102);
}

function doFifth(x, y, animation, pScope) {
  pScope.fill_background(50, 50, 50, 51);
}

/*
  generateStar() takes a coordinate and builds a star based on that coord
*/

function generateStar(xPos, yPos, animation, pScope)  {
  let scaleMod = random(0, 1.5);  //  Gives a bit of variety to the stars - makes them 'pulse' by changing radiuses
  push();
  noStroke();
  fill(starCol);
  ellipse(xPos, yPos, starDiam * (animation.frame * scaleMod), starDiam * (animation.frame * scaleMod));
  pop();
}

/*
  drawGrid() is a function used to generate a grid ontop of the disk.
  Allows easier planning of coordinates rather than just outright guessing where
  stuff will sit.
*/

function drawGrid() {
  stroke(100)
  strokeWeight(5)
  line(0, 0, 0, -1000);// mid vertt
  line(-500, -500, 1000, -500); //mid horiz
  line(-500, -250, 1000, -250); // low horiz
  line(-500, -750, 1000, -750);
  line(-250, 0, -250, -1000);
  line(250, 0, 250, -1000);
}
