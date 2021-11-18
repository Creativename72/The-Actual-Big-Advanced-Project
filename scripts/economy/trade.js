import {addTrade,getUserData,updateBackpackData, deleteTrade} from "../firebaseJunk/database.js"

import {MaterialBackpack, MaterialStack} from "./material.js"
export class Trade{
  /*
    a class representing an interaction between users, offering one item and recieving another
  */

  constructor(buyerGets, sellerGets, seller){
    this.timePosted = Date.now();
    this.buyer = null;
    this.buyerGets = buyerGets;
    this.sellerGets = sellerGets;
    this.seller = seller; 
    //TODO: make sure ids do not overlap
    this.id = Math.round(Math.random()*100000000);
    this.defaultCallback = (a,val) => {console.log(a);return val}
  }
  construct(obj){
    this.timePosted=obj.timePosted;
    this.buyer=obj.buyer;
    this.buyerGets=obj.buyerGets;
    this.sellerGets=obj.sellerGets;
    this.seller = obj.seller;
    this.id = obj.id;
  }
  async validate(callback = this.defaultCallback ){
    return new Promise(async (res)=>{
    var sellerData = await getUserData(this.seller);
    
    var sellerBackpack = new MaterialBackpack();
    sellerBackpack.construct(sellerData.materials)
    console.log(sellerBackpack)
    if (!sellerBackpack.canAfford([this.buyerGets])){
      res(callback("",false));
    }

    if(this.buyer){
      var buyerData = await getUserData(this.buyer);
      var buyerBackpack = new MaterialBackpack();
      buyerBackpack.construct(buyerData.materials)
      if (!buyerBackpack.canAfford([this.sellerGets])){
      res( callback("",false));
      } 
    }

    if(!(this.seller&&this.buyerGets.type&&this.buyerGets.quantity&&this.sellerGets.type&&this.sellerGets.quantity)){
      res(callback("",false))
    }
    
    res( callback("",true))

 });
  }

  store(){
    console.log("storing"+this);
    addTrade(this);
  }

  toJSON(){
    return {
      timePosted: this.timePosted,
      buyer: this.buyer,
      buyerGets: this.buyerGets,
      sellerGets: this.sellerGets,
      seller: this.seller,
      id: this.id
    }
  }

  async fulfill(user,userBackpack) {
    var bool = await this.validate()
    if(bool){
      alert("failed trade");
      return
    }


    var sellerData = await getUserData(this.seller);
  
    var sellerBackpack = new MaterialBackpack();
    sellerBackpack.construct(sellerData.materials)
    //items -= sellerGets
    //items += buyerGets
    
    sellerBackpack.subMaterialStack(new MaterialStack(this.buyerGets.material.type,this.buyerGets.quantity))
    sellerBackpack.addMaterialStack(new MaterialStack(this.sellerGets.material.type,this.sellerGets.quantity))

    userBackpack.addMaterialStack(new MaterialStack(this.buyerGets.material.type,this.buyerGets.quantity))
    userBackpack.subMaterialStack(new MaterialStack(this.sellerGets.material.type,this.sellerGets.quantity))

    
    this.buyer=user.uid;
    updateBackpackData(this.buyer, userBackpack);
    updateBackpackData(this.seller, sellerBackpack)
    deleteTrade(this);
  

  }

}