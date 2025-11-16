const DESIGN_H = 800;
const DESIGN_W = 600;

let branches = [];
let apples = [];
let gravity = 0.2;
let gravityDirection = 1;
let ground = 750;
let topY = 20;
let noisePoints = [];
let scaleFactor;
let song1, song2, currentSong, analyser; // for future control. 
let volume = 1.0;
let LevelSmoothed = 0;
let appleScale = 1;
let bgPulse = 0; 
let changeMusicButton;


//preload song.
function preload(){
  song1 = loadSound("Assets/Hip-hop-02-738.mp3");
  song2 = loadSound("Assets/hazy-after-hours-132.mp3");
}
//Segment Class (Tree Branch).
class Segment{
  constructor(x,y,length,angle,level){
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.level = level;
  //Different thickness for different branch level.
    if(this.level === 1){
      this.thickness = 15;
    } else if(this.level === 2){
      this.thickness = 10;
    } else if(this.level === 3){
      this.thickness = 7;
    } else{
      this.thickness = 4
    }
  // Small waving animation values.
    this.swayAmp = random(1,3);
    this.swaySpeed = random(0.2, 0.2);
  // Calculate the end point of the branch based on angle.
    this.x2 = this.x + cos(this.angle) * this.length;
    this.y2 = this.y - sin(this.angle) * this.length;
  }

  
  draw(){
    // Set branches' color
    stroke(0);
    strokeWeight(this.thickness);
    
    let sway = sin(frameCount* this.swaySpeed + this.y * 0.05)* this.swayAmp;

    let newX = this.x + cos(this.angle + radians(sway * 0.5)) * this.length;
    let newY = this.y - sin(this.angle + radians(sway * 0.5)) * this.length;

    line(this.x, this.y, newX, newY);
    //let branches silghtly wave.
  }
}
// Apple class(generate, sway, drop)
class Apple {
  constructor(x,y,color){
    this.stratX = x;
    this.stratY = y;
    this.x = x;
    this.y = y;
    this.dropSpeed = 0;
    this.color = color;
    this.state = "waiting";
    this.timer = 0; 
   // Slight left and right swing while apple are hanging.
    this.swayRate = random(1.0, 3.0);    
    this.swaySpeed = random(0.5, 0.3); 
    this.swayPhase = random(0, TWO_PI); 
  }     
  reset(){
    // Reset apple to initial position.
    this.x = this.stratX;
    this.y = this.stratY;
    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0;
    this.swayPhase = random(0, TWO_PI);
  }
  update(){
    // Waiting for 2 seconds before falling.
    if (this.state ==="waiting"){
      this.timer++;
      if(this.timer > 120){
        this.state = "falling";
        this.timer = 0;
      }
      // Apply gravity.
    } else if (this.state ==="falling"){
      this.dropSpeed += gravity * gravityDirection;
      this.y += this.dropSpeed;
      // Hit ground.
    if ( gravityDirection === 1 && this.y >= ground) {
      this.y = ground;
      this.state = "landed";
      this.dropSpeed = 0;
      this.timer = 0;
      // Hit top(when reversed gravity)
    } else if (gravityDirection === -1 && this.y <=topY){
      this.y = topY;
      this.state = "landed";
      this.dropSpeed = 0;
      this.timer = 0;
    }
  }
    // Rest for 2 seconds then return to tree.
      else if (this.state === "landed"){
        this.timer++;
        if(this.timer > 120){
          this.reset();
        }
      }
    }
  
  draw(){
    stroke(225,225,0);
    fill(this.color[0],this.color[1],this.color[2]);
    
    let drawX = this.x;
    let drawY = this.y;
    // Slight sway when hanging.
    if (this.state === "waiting") {
      const t = frameCount * this.swaySpeed + this.swayPhase;
      drawX += sin(t) * this.swayRate;
    }

      ellipse(drawX, drawY, 40 * appleScale, 40 * appleScale);
  }
}
//Recursive Tree Generator
function generateTree(x, y, length, angle, level){
  if (length < 40) return;
  
  let branch = new Segment(x, y, length, angle, level);
  branches.push(branch);

  let angleOffset = random(radians(30),radians(90));

  let endX = branch.x2;
  let endY = branch.y2;
   //Random chance to grow an apple on highter level branch.
  if (level >= 3 && random() < 0.2) {
    let t = random(0.3,0.9);
    let appleX = lerp(branch.x, branch.x2, t);
    let appleY = lerp(branch.y, branch.y2, t);
    let colorChoice = [
      [240,70,70],
      [240,140,60],
      [220,120,120],
      [230,90,140],
      [250,120,90],
      [210,100,150]
    ];
    let c = random(colorChoice);
    apples.push(new Apple(appleX, appleY, c));
  }
  /*The transition from "if(level >= 3)" to "apples.push(new Apple(appleX, appleY, c));"
  is partly obtained by asking ChatGPT, The specific question-and-answer process will be placed in the appendix.*/

  generateTree(endX, endY, length* 0.75, angle + angleOffset, level + 1);
  generateTree(endX, endY, length* 0.75, angle - angleOffset, level + 1);
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  frameRate(60);  
  // Keep 600* 800 proportion across screens.  
  scaleFactor = min(windowWidth/ DESIGN_W, windowHeight/ DESIGN_H); 
  // The music1 is played by default.
  currentSong = song1;
  analyser = new p5.Amplitude();
  analyser.setInput(currentSong);
  // Create play/Pause button, and music1/music2 button. 
  let button = createButton("Play/Pause");
  button.position(25,15);
  button.mousePressed(PlayPause);
  button.style("font-size","20px");
  button.style("padding","5px 10px");

  changeMusicButton = createButton("music 1 ");
  changeMusicButton.position(25,60);
  changeMusicButton.mousePressed(changeMusic);
  changeMusicButton.style("font-size","20px");
  changeMusicButton.style("padding","5px 10px");
  // Generate background noise lines.
  for (let i = 0; i < 1500; i++){
    noisePoints.push({
      x: random(-width - 1000, width + 1000),
      y: random(0, 650),
      c:[random(100,180), random(150,200), random(200,255), random(80,150)]
    });
  }
  // Generate a full recursive tree.
  generateTree(300, 650, 200, PI / 2, 1);
}

// Main draw loop
function draw(){
  // Use music level to control the color of background.
  let level = analyser ? analyser.getLevel() : 0;
  bgPulse = lerp(bgPulse, level, 0.1); 
  let t = constrain(map(bgPulse, 0, 0.3, 0, 1), 0, 1) * 1.5; 
  
  let baseCol = color(60, 80, 120);
  let peakCol = color(80, 110, 160);
  let bgCol = lerpColor(baseCol, peakCol, t);
  background(bgCol);

  if (currentSong && currentSong.isPlaying()) {
  volume = map(mouseY, height, 0, 0 , 1, true);
  currentSong.setVolume(volume);
}

  let levelNow = analyser.getLevel();
  LevelSmoothed = lerp (LevelSmoothed, levelNow, 0.2);
  appleScale = map (LevelSmoothed, 0, 0.3, 0.9, 1.8, true);

  push();
  scale(scaleFactor);
  translate((width / scaleFactor - DESIGN_W)/ 2, (height/ scaleFactor - DESIGN_H)/2);
  // Draw background noise.
  /*Use the volume of the music to control the length of the "raindrops".*/
    let noiceLevel = analyser.getLevel();                     
    let lineScale = map(noiceLevel, 0, 0.4, 100, 200);         
    let angle = radians(80);

    for (let p of noisePoints){
    stroke(p.c[0], p.c[1], p.c[2], p.c[3]);
    strokeWeight(2);

    let len = lineScale;
    let x2 = p.x + cos(angle) * len;
    let y2 = p.y + sin(angle) * len;

    line(p.x, p.y, x2, y2);
  }
  // Ground.
  fill(40,140,90);
  rect(0,650,600,100);
  stroke(0);
  strokeWeight(5);
  noFill();
  rect(0,650,600,100);
  noStroke();

  // Yellow base
  fill(240,210,60);
  stroke(0);
  strokeWeight(10);
  rect(125,625,350,75);
  noStroke();

  // Colorfull rects
  const colors = [
    color(240,210,60),
    color(240,70,70),
    color(40,160,100),
    color(240,210,60),
    color(40,160,100),
    color(240,210,60)
  ];
  const startX = 125;
  const startY = 625;
  const boxW = 350 / 6;
  const boxH = 75;

  for (let i = 0; i < 6; i++){
    fill(colors[i]);
    rect(startX + i * boxW, startY, boxW, boxH);
  }
  
  const bottomColors = [
    color(40,160,100),
    color(240,210,60),
    color(240,70,70),
    color(240,70,70),
    color(240,210,60),
    color(40,160,100)
  ];

  for (let i = 0; i < 6; i++){
    let cx = startX + i * boxW + boxW / 2;
    let cy = startY + boxH;
    let r = boxW * 0.9;
    fill(bottomColors[i]);
    arc(cx, cy, r, r, PI, 0);
  }

  const topColors = [
    color(40, 160, 100),
    color(240, 70, 70),
    color(40, 160, 100),
    color(240, 70, 70)
  ];
  const topCenters = [
    startX + boxW * 1.5,
    startX + boxW * 2.5,
    startX + boxW * 3.5,
    startX + boxW * 4.5
  ];
  for (let i = 0; i < 4; i++){
    let cx = topCenters[i];
    let cy = startY;
    let r = (i === 1 || i === 2) ? boxW * 0.7 : boxW * 0.9;
    fill(topColors[i]);
    arc(cx,cy,r,r,0,PI);
  }

  noStroke();
  for (let i = 0; i < 300; i++){
    fill(255,255,255,random(10,40));
    rect(random(125,475),random(625,700), 1, 1);
  }
  // Draw all branches.
  for (let branch of branches ){
    branch.draw(); 
  }
  // Draw and update all apples.
  for (let a of apples){
    a.update();
    a.draw();
  }
  // Display gravity control text.
  noStroke();
  fill(255);
  textSize(15);
  if(gravityDirection === 1){
    text("Press SPACE to change gravity (now ↓ ↓ ↓) / Mouse up & down adjusts volume.",20,785);
  }else{
    text("Press SPACE to change gravity (now ↑ ↑ ↑) / Mouse up & down adjusts volume.",20,785);
  }
    text("- Dancing in the thunderstorm -",240,30);
    pop();
}
// Add playPause() function to control the playing and pausing of music.
function PlayPause(){
  if (!currentSong) return;

  if (currentSong.isPlaying()){
    currentSong.stop();
  } else {
    currentSong.loop();
    currentSong.setVolume(volume); 
  }
}
function changeMusic(){
  if (!song1 || !song2) return;

  let wasPlaying = currentSong && currentSong.isPlaying();
// When click stop all songs.
  if (song1.isPlaying()) song1.stop();
  if (song2.isPlaying()) song2.stop();

  if (currentSong === song1){
    currentSong = song2;
    changeMusicButton.html("music 2");
  } else {
    currentSong = song1;
    changeMusicButton.html("music 1");
  }
/* This code (about change music) was obtained by referring to the suggestions of ChatGPT.
I put the communication process in the Redame appendix.*/
  analyser.setInput(currentSong);

  if (wasPlaying){
    currentSong.loop();
    currentSong.setVolume(volume);
  }
}
// Make the canvas size match the screen size.
function fitWidow(){
  resizeCanvas(windowWidth,windowHeight);
  scaleFactor = min(windowWidth / DESIGN_W, windowHeight/ DESIGN_H);
}
// Add keypress to control the direction of gravity.
function keyPressed(){
  if (key === ' '){
    gravityDirection *= -1;
    for (let a of apples){
      a.reset();
    } 
  }
}