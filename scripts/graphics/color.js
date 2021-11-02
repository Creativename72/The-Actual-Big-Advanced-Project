export class RGB{
  constructor(r1,r2,r3){
    this.r1 = r1;
    this.r2 = r2;
    this.r3 = r3;
  }
  toString(){
    return "rgb("+this.r1+","+this.r2+","+this.r3+")"
  }
  randomShift(){
    let rchoice = Math.round(Math.random()*3);
    switch (rchoice){
      case 0:
        this.addR1(10)
      case 1:
        this.addR2(10)
      case 2:
        this.addR3(10)
    }
  }
  chooseRandomTarget(){
    this.tr1 = Math.round(Math.random() * 100) + 155;
    this.tr2 = Math.round(Math.random() * 100) + 155;
    this.tr3 = Math.round(Math.random() * 100) + 155;
    return {r: this.tr1, g: this.tr1, b: this.tr1};
  }
  shiftTowardTarget(clicks) {
    var maxClicks = 25;
    var percentTarget = clicks/maxClicks;
    this.r1 = (this.tr1)*percentTarget;
    this.r2 = (this.tr2)*percentTarget;
    this.r3 = (this.tr3)*percentTarget;
  }

  addR1(num){
    if (this.r1>255-num){
      this.r1=(this.r1+num)%255;
    }
    else{
      this.r1+=num
    }
  }
  addR2(num){
    if (this.r2>255-num){
      this.r2=(this.r2+num)%255;
    }
    else{
      this.r2+=num
    }
  }
  addR3(num){
    if (this.r3>255-num){
      this.r3=(this.r3+num)%255;
    }
    else{
      this.r3+=num
    }
  }
}