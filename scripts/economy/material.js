export const costs = {"Silicon":3,"Plastic":1,"Copper":4,"Gold":8,"Aluminum":4,"Silver":6,"Zinc":3,"Bit":2};

export class Material {
  constructor(type) {
    this.type = type;
    if(!this.type){
      console.log("bad input to material type")
    }
    this.cost = costs[type];
  }
}

export class IdleItem{
  constructor(type,numPerTick) {
    this.toAdd = new MaterialStack(type,numPerTick)
  }

}
/*export class IdleStack{
  constructor(type,quantity)
}
*/

export class MaterialStack {
  constructor(type, quantity = 1) {
    this.material = new Material(type)
    this.quantity = quantity
    //write function for updating this
    this.type = type;
  }
  
}

export class MaterialBackpack{
  constructor() {
    this.dict = {};
    this.addBits(0);
    this.idleItems={};
  }

  addBits(bitNum){
    if ("Bit" in this.dict) {
      this.dict["Bit"].quantity += bitNum;
    } else {
      this.dict["Bit"] = new MaterialStack("Bit",bitNum)
    }
  }
  
  addMaterialStack(stack) {
    //console.log("added", stack)
    if (stack.type in this.dict) {
      this.dict[stack.type].quantity += stack.quantity;
    } else {
      console.log("2")
      this.dict[stack.type] = new MaterialStack(stack.type,stack.quantity)
    }
  }
  
  subMaterialStack(stack) {
    if (stack.type in this.dict) {
      this.dict[stack.type].quantity -= stack.quantity;
    } else {
      this.dict[stack.type] = new MaterialStack(stack.type,-stack.quantity)
    }
  }

  toJSON(){
    return this.dict
  }

  construct(dict){
    this.dict = dict
  }

  getNetWorth(){
    var total = 0;
    for (var type in this.dict ){
      if(type == "Bit"){
        total+=this.dict[type].quantity
      }
      else{
        total+=this.dict[type].quantity*costs[type];
      }
    }
    return total;
  }
}