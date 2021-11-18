export class Material {
  constructor(type) {
    this.type = type;
    if(!this.type){
      console.log("bad input to material type")
    }
    this.cost = costs[type];
  }
}

const secondsPerTick = 1;

export class IdleItem{
  constructor(type,tickDelay,toAdd) {
    this.type = type;
    this.toAdd = toAdd;
    this.tickDelay = tickDelay;
    this.timer = null;
    this.timeUp = 0;
    //this.parent = parent
  }

  toJSON(){
    return {
      type: this.type,
      toAdd:this.toAdd,
      tickDelay:this.tickDelay,
      timeUp:0
    }
  }

  construct(json){
    this.type=json.type;
    this.toAdd=json.toAdd;
    this.timeUp=0;
    
  }
}

export class MaterialStack {
  constructor(type, quantity = 1) {
    this.material = new Material(type)
    this.quantity = quantity
    //write function for updating this
    this.type = type;
  }
  
}
export class IdleItemStack {
  constructor(model, quantity = 1,parent) {
    this.model = model;
    if (typeof model =="string"){
      this.model = prefabs[model].model
    }
    this.parent = parent
    this.quantity = quantity
    //write function for updating this
    this.type = this.model.type;
    this.timer=null;
    //console.log(this.parent)
  }
  runOnline(){
    if(this.timer){
      clearInterval(this.timer)
    }
    this.timer = setInterval(()=>{
      for (var i in this.model.toAdd){
        var toAdd=new MaterialStack(this.model.toAdd[i].type,this.model.toAdd[i].quantity*this.quantity);
        //console.log(toAdd.quantity)
        this.parent.addMaterialStack(toAdd)
      }
      this.model.timeUp+=1;
      console.log(this.type+" : "+this.model.timeUp)
    }, this.model.tickDelay*secondsPerTick*1000)
  }
  runOffline(time){
    var difference = Date.now()-time;
      for (var i in this.model.toAdd){
        var num =this.model.toAdd[i].quantity*this.quantity*difference/(this.model.tickDelay*secondsPerTick*1000);
        this.parent.addMaterialStack(new MaterialStack(this.model.toAdd[i].type,num))
      }
      
  }
  stopOnline(){
    if(this.timer){
      clearInterval(this.timer)
    }
  }
  toJSON(){
    return {
      model: this.model.toJSON(),
      quantity:this.quantity,
      type: this.type,
    }
  }

}


export class ItemBackpack{
  constructor() {
    this.dict = {};
  
  }
  count(type){
    return this.dict[type]?this.dict[type].quantity:0
  }
  runAll(){
    for(var key in this.dict){
      this.dict[key].runOnline();
    }
  }
  runAllOffline(time){
    for(var key in this.dict){
      this.dict[key].runOffline(time);
    }
  }
  topAll(){
    for(var key in this.dict){
      this.dict[key].stopOnline();
    }
  }
  addIdleItemStack(stack) {
    //console.log("added", stack)
    if (stack.type in this.dict) {
      this.dict[stack.type].quantity += stack.quantity;
    } else {
      //console.log("2")
      this.dict[stack.type] = stack
    }
    
  }
  
  subIdleItemStack(stack) {
    if (stack.type in this.dict) {
      this.dict[stack.type].quantity -= stack.quantity;
    } else {
      this.dict[stack.type] = stack
    }
  }

  toJSON(){
    var res= {};
    for (var key in this.dict){
      res[key]=this.dict[key].toJSON();
    }
    return res
  }

  construct(json,parent=null){
    this.idleItems = {};
    if (!json){
      return
    }
    for (var type in json)
    {
      var temp = new IdleItem(json[type].model.type,json[type].model.tickDelay,json[type].model.toAdd)
      this.addIdleItemStack(new IdleItemStack(temp, json[type].quantity,parent))
    }

  }

}



export class MaterialBackpack{
  constructor(app=null) {
    this.dict = {};
    this.addBits(0);

    this.app=app
    console.log(this.app)
  }

  addBits(bitNum){
    if ("Bit" in this.dict) {
      this.dict["Bit"].quantity += bitNum;
    } else {
      this.dict["Bit"] = new MaterialStack("Bit",bitNum)
    }
  }
  
  amount(key) {
    return this.dict[key].quantity
  }

  count(type){
    return this.dict[type]?this.dict[type].quantity:0
  }

  addMaterialStack(stack) {
    
    if (stack.type in this.dict) {
      this.dict[stack.type].quantity += stack.quantity;
      this.dict[stack.type].quantity=Math.trunc(this.dict[stack.type].quantity) 
    } else {
      //console.log("2")
      this.dict[stack.type] = new MaterialStack(stack.type,stack.quantity)
      this.dict[stack.type].quantity=Math.trunc(this.dict[stack.type].quantity) 
    }
    if(this.app){
      
      this.app(this)
    }
  }
  
  subMaterialStack(stack) {
    if (stack.type in this.dict) {
      this.dict[stack.type].quantity -= stack.quantity;
    } else {
      this.dict[stack.type] = new MaterialStack(stack.type,-stack.quantity)
    }
    if(this.app){
      this.app(this)
    }
  }

  subMaterialStacks(list){
    for (var i in list){
      this.subMaterialStack(list[i]);
    }
  }

  canAfford(materialList){
    //console.log("called with", materialList)
    for (var i in materialList) {
      console.log(this.count(materialList[i].type))
      if (this.count(materialList[i].type) < materialList[i].quantity) {
        return false;
      } 
    }
    return true;

  }


  toJSON(){
    return this.dict
  }

  construct(json){

    this.dict = json
    if(this.app){
      this.app(this)
    }
  }
  altConstruct(other){

    this.dict = Object.assign({}, other.dict); 
    
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

export const costs = {"Silicon":3,"Plastic":1,"Copper":4,"Gold":8,"Aluminum":4,"Silver":6,"Zinc":7,"Bit":2};


export const prefabs = {
  "Pointer":{
    model:new IdleItem("Pointer",10,[new MaterialStack("Bit",1)]),
    cost:[new MaterialStack("Plastic",5),new MaterialStack("Bit",10)],
    description:""
  },"Dad's_PC":{
    model:new IdleItem("Dad's_PC",10,[new MaterialStack("Bit",1)]),
    cost:[new MaterialStack("Silicon",10),new MaterialStack("Bit",100)],
    description:""
  },"Plastic_Mining_Rig":{
    model:new IdleItem("Plastic_Mining_Rig",10,[new MaterialStack("Plastic",1)]),
    cost:[new MaterialStack("Plastic",10)],
    description:"Mine the great garbage patch"
  },
  "Silicon_Mining_Rig":{
    model:new IdleItem("Silicon_Mining_Rig",10,[new MaterialStack("Silicon",1)]),
    cost:[new MaterialStack("Silicon",10)],
    description:""
  }

}