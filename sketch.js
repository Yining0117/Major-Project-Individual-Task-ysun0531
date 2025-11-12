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
let song, analyser;
let volume = 1.0;
let pan = 0.0;

function preload(){
  song = loadSound("Assets/Hip-hop-02-738.mp3");
}

class Segment{
  constructor(x,y,length,angle,level){
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.level = level;

    if(this.level === 1){
      this.thickness = 15;
    } else if(this.level === 2){
      this.thickness = 10;
    } else if(this.level === 3){
      this.thickness = 7;
    } else{
      this.thickness = 4
    }

    this.swayAmp = random(1,3);
    this.swaySpeed = random(0.2, 0.2);

    this.x2 = this.x + cos(this.angle) * this.length;
    this.y2 = this.y - sin(this.angle) * this.length;
  }

  
  draw(){
    stroke(0);
    // ↑ branches' color
    strokeWeight(this.thickness);
    
    let sway = sin(frameCount* this.swaySpeed + this.y * 0.05)* this.swayAmp;

    let newX = this.x + cos(this.angle + radians(sway * 0.5)) * this.length;
    let newY = this.y - sin(this.angle + radians(sway * 0.5)) * this.length;

    line(this.x, this.y, newX, newY);
    //let branches silghtly wave.
  }
}

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

    this.swayRate = random(1.0, 3.0);    
    this.swaySpeed = random(0.5, 0.3); 
    this.swayPhase = random(0, TWO_PI); 
  }     
  reset(){
    //back to the tree.
    this.x = this.stratX;
    this.y = this.stratY;
    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0;
    this.swayPhase = random(0, TWO_PI);
  }
  update(){
    if (this.state ==="waiting"){
      this.timer++;
      if(this.timer > 120){
        this.state = "falling";
        this.timer = 0;
      }
    } else if (this.state ==="falling"){
      this.dropSpeed += gravity * gravityDirection;
      this.y += this.dropSpeed;
    
    if(gravityDirection === 1 && this.y >= ground){
      this.y = ground;
      this.state = "landed";
      this.dropSpeed = 0;
      this.timer = 0;
    } else if (gravityDirection === -1 && this.y <=topY){
      this.y = topY;
      this.state = "landed";
      this.dropSpeed = 0;
      this.timer = 0;
    }
  }
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
    if (this.state === "waiting") {
      const t = frameCount * this.swaySpeed + this.swayPhase;
      drawX += sin(t) * this.swayRate;}

    
      ellipse(drawX, drawY, 40, 40);
  }
}

function generateTree(x, y, length, angle, level){
  if (length < 40) return;
  
  let branch = new Segment(x, y, length, angle, level);
  branches.push(branch);

  let angleOffset = random(radians(30),radians(90));

  let endX = branch.x2;
  let endY = branch.y2;
  
  if (level >= 3 && random()<0.2){
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
  is entirely obtained by asking ChatGPT*/

  generateTree(endX, endY, length* 0.75, angle + angleOffset, level + 1);
  generateTree(endX, endY, length* 0.75, angle - angleOffset, level + 1);
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  frameRate(60);  
  scaleFactor = min(windowWidth/ DESIGN_W, windowHeight/ DESIGN_H);

  analyser = new p5.Amplitude();
  analyser.setInput(song);

  let button = createButton("Play/Pause");
  button.position(100,20);
  button.mousePressed(PlayPause);

  for (let i = 0; i < 1000; i++){
    noisePoints.push({
      x: random(-width - 1000, width + 1000),
      y: random(0, 650),
      c:[random(100,180), random(150,200), random(200,255), random(80,150)]
    });
  }
  generateTree(300, 650, 200, PI / 2, 1);
}


function draw(){
  //base background
  background(60,80,120);

  push();
  scale(scaleFactor);
  translate((width / scaleFactor - DESIGN_W)/ 2, (height/ scaleFactor - DESIGN_H)/2);

  noStroke();
  for (let p of noisePoints){
    fill(p.c[0],p.c[1],p.c[2],p.c[3]);
    rect(p.x, p.y, 100, 2);
  }

  fill(40,140,90);
  rect(0,650,600,100);
  stroke(0);
  strokeWeight(5);
  noFill();
  rect(0,650,600,100);
  noStroke();

  //yellow base
  fill(240,210,60);
  stroke(0);
  strokeWeight(10);
  rect(125,625,350,75);
  noStroke();

  //colorfull rects
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

  for (let branch of branches ){
    branch.draw(); 
  }

  for (let a of apples){
    a.update();
    a.draw();
  }
  
  noStroke();
  fill(255);
  textSize(25);
  if(gravityDirection === 1){
    text("Press SPACE to change gravity (now ↓ ↓ ↓)",20,785);
  }else{
    text("Press SPACE to change gravity (now ↑ ↑ ↑)",20,785);
  }
    text("- Let Newton be confused ! ! ! -",240,30);
    pop();
}

function PlayPause(){
  if (song.isPlaying()){
    song.stop();
  } else {
    song.loop();
  }
}

function fitWidow(){
  resizeCanvas(windowWidth,windowHeight);
  scaleFactor = min(windowWidth / DESIGN_W, windowHeight/ DESIGN_H);
}

function keyPressed(){
  if (key === ' '){
    gravityDirection *= -1;
    for (let a of apples){
      a.reset();
    } 
  }
}