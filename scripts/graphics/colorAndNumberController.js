import {getRandomNumberString} from "../math/functions.js"
//import {clickCounter} from "../timers.js"
export class ColorController {
  constructor(backgroundColor) {
    this.clicks = 1;
    this.slowestSpeed = 2000;
    this.maxChange = 40;
    this.colorShiftThreshold = 4;
    this.updateSpeed = this.slowestSpeed;
    //this.spinyClickThingy = this.getSpinyClickThingy(this.updateSpeed);
    this.colorChange = this.slowestSpeed;
    this.maxColorChange = 4;
    this.backgroundColor = backgroundColor;
    this.backgroundColor.chooseRandomTarget();
    this.colorClicks=0;
    this.numLength=10;
    this.colorControlTimer = setInterval(()=>this.main, 10);
  }
  


  colorShift(updateSpeed) {
    //console.log(updateSpeed)
    this.backgroundColor.shiftTowardTarget(this.colorClicks);
    var buttonBackground = document.getElementsByClassName("mining-container")[0];
    buttonBackground.style.backgroundColor = this.backgroundColor;
  }


  main() {
    if (this.colorClicks <= this.colorShiftThreshold) {
      this.backgroundColor.chooseRandomTarget()
      this.colorClicks = this.colorShiftThreshold;
    } else {
      this.colorShift(this.colorClicks);
      this.colorClicks = (this.colorClicks ** .999 );
    } 
  }

}

export class NumberController {
  constructor() {
    this.clicks = 1;
    this.slowestSpeed = 2000;
    this.maxChange = 40;
    this.updateSpeed = this.slowestSpeed
    this.spinyClickThingy = this.getSpinyClickThingy(this.updateSpeed)
    this.numLength = 10;
    this.clickCounter = setInterval(() => {
      var newUpdateSpeed = 1 / this.clicks * 400
      //console.log(this.clicks)
      //makes gradual slowing down effect
      if (newUpdateSpeed > this.updateSpeed && newUpdateSpeed > this.updateSpeed + this.maxChange) {
        newUpdateSpeed = this.updateSpeed + this.maxChange;
      }
      if (newUpdateSpeed > this.slowestSpeed) {
        newUpdateSpeed = this.slowestSpeed;
      }

      this.updateSpeed = newUpdateSpeed;
      clearInterval(this.spinyClickThingy);
      this.spinyClickThingy = this.getSpinyClickThingy(this.updateSpeed)

      this.clicks = 1
      //console.log("new spiny click",updateSpeed)
    }, this.slowestSpeed + 1)
  }

  main() {
  
  }

  getSpinyClickThingy(ms) {
    //console.log(ms)
    return setInterval(() => getRandomNumberString(this.numLength), ms)
  }

}

//controls color formulas and outputs
