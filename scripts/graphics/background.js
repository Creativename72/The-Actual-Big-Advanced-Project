var gameSpeed = 10
class particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speedX = random(-3,3);
    this.speedY = random(-5,5);
    this.accelX = 0;
    this.accelY = 0;
    this.diameter =  8;
    this.color = this.x / 4
    var tempParticle = this;
    if (particlesList.length > 1) {
      tempParticle = particlesList[int(random(particlesList.length))];
    }
    this.particle1 = tempParticle;
  }
  render() {
    var bounceSpeedMult = 1;
    if (this.x > width) {
      this.x = width
      this.speedX *= -1 * bounceSpeedMult;
      this.speedY *= bounceSpeedMult;
    } else if (this.x < 0) {
      this.x = 0;
      this.speedX *= -1 * bounceSpeedMult;
      this.speedY *= bounceSpeedMult;
    } else if (this.y < 0) {
      this.y = 0
      this.speedX *= bounceSpeedMult;
      this.speedY *= -1 * bounceSpeedMult;
    } else if (this.y > height+100) {
      this.y = height + 100;
      this.speedX *= bounceSpeedMult;
      this.speedY *= -1 * bounceSpeedMult;
    }
    if (this.particle1 != "a") {
       stroke(240, 46, 170)
       line(this.x,this.y,this.particle1.x,this.particle1.y)
    }

    fill(255, 109, 0)
    noStroke();
    circle(this.x,this.y,10)
    this.x += this.speedX
    this.y += this.speedY
    this.speedX += this.accelX
    this.speedY += this.accelY 
  }
}
particlesList = [];

function addParticle() {
  particlesList.push(new particle())
}

function setup() {
  
  let canvas = createCanvas(windowWidth/3, windowHeight);
  canvas.parent('sketch-container');
  for (var i = 0; i < 3; i++) {
    addParticle()
  }
  stroke(66,9,108)
  
  
  //TODO: make this good convention
  document.getElementById("main-button").addEventListener("click", () => addParticle())
}



function draw() {
  
  background(0)
  if (mouseIsPressed) {
    gameSpeed = -10
  } else {
    gameSpeed = 10
  }
  for (var i in particlesList) {
    particlesList[i].render()
  }
  
  for(var i=0;i<particlesList.length;i++){
    if(particlesList[i].y>=windowHeight+100 && random(0,4)>2){
      particlesList.splice(i,1);
      i-=1;
      }
    }
  
}

function windowResized() {
  resizeCanvas(windowWidth/3, windowHeight);
}

