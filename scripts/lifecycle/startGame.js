import {writeUserData, updateBackpackData,getUserData,getTrades, attachTradeListener, updateUserTimeStamp, getLeaderboardListener,updateItemData} from "../firebaseJunk/database.js"
import {firebaseSetup,signOutUser} from "../firebaseJunk/initializeApp.js"
import {getRandomNumberString, bitUnitConversion} from "../math/functions.js"
import {RGB} from "../graphics/color.js"
import {ColorController, NumberController} from "../graphics/colorAndNumberController.js"
import {costs, prefabs, Material, MaterialStack, MaterialBackpack, IdleItem, IdleItemStack, ItemBackpack} from "../economy/material.js"
import {Trade} from "../economy/trade.js"


export class App {
  //acts as the "main" function
  async build(){
    this.startLoadingScreen();
    this.user = await firebaseSetup();
    await writeUserData(this.user.uid, this.user.displayName, this.user.email);
    

    this.userData = await getUserData(this.user.uid);
    
    this.userBackpack = new MaterialBackpack((a)=>this.idleCallback(a));
    this.userBackpack.construct(this.userData.materials)
    
     //ItemBackpack Tests:
    var tempItemBackpack = new ItemBackpack();
    tempItemBackpack.construct(this.userData.items,this.userBackpack);  
    this.itemBackpack = tempItemBackpack
    if(!this.userData.items){
      //console.log(tempItemBackpack.toJSON())
      var pointer = "pointer"
      
      this.itemBackpack.addIdleItemStack(new IdleItemStack(pointer, 1, this.itemBackpack));
      alert("Congratulations you've unlocked your first idle item. [Object Pointer: Bits/sec = 0.1]")
      //console.log(this.itemBackpack)
      updateItemData(this.user.uid,this.itemBackpack)
    }
    //console.log(this.itemBackpack.toJSON())
    this.itemBackpack.runAllOffline(this.userData.logOutTime)
    this.itemBackpack.runAll();




    //console.log("Building...",this.userBackpack)

    window.addEventListener("beforeunload", ()=>updateUserTimeStamp(this.user.uid));
    this.numberController = new NumberController();
    this.numLength = 10;
    this.money = this.userBackpack.count("Bit");
    

    document.getElementById("username").innerHTML = this.user.displayName
    this.refreshUserBackpack(this.userBackpack);

    var leaderboardListener = getLeaderboardListener(this.onNetWorthChange);








    //tests for trade fuffilment.
    this.rawTrades = await getTrades();
    this.trades=[];
    //console.log(this.rawTrades.length)
    for (var i=0;i<this.rawTrades.length;i++){
      var temp = new Trade();
      temp.construct(this.rawTrades[i])
      this.trades.push(temp)
    }
    
    document.getElementById("create-trade-container").style.display = "none"
    document.getElementById("material-button-container").style.display = "inline"











    this.addMaterialButtons();
    this.addIdleItemButtons();
    this.displayTradeOptions();
    this.createCreateTradeSelect();
    this.createNavigationListeners(); 
    this.addIdleItemDisplay()
    //Part2ElectricBoogaloo
    
    
    //Part2ElectricBoogaloo
    //binds onButtonUpdate to click of the main button
    document.getElementById("main-button").addEventListener("click", () => this.onButtonUpdate())
    document.getElementById("sign-out-button").addEventListener("click", signOutUser)
    document.getElementById("create-trade-button").addEventListener("click",()=>this.onCreateTradeClick())
    attachTradeListener(()=>this.displayTradeOptions());



    this.stopLoadingScreen()
  }
  
  startLoadingScreen(){
    var screen = document.getElementById("loading-screen")
    screen.classList.remove("load-hidden")
    var text = document.createElement("h1")
    screen.appendChild(text)
    var base = "......"
    var dots = 0
    this.loadTimer = setInterval(()=>{
      text.innerHTML = "Loading"+base.slice(0,dots%4);
      dots++;
      console.log(dots)
    },900)

    
    

    
  }

  stopLoadingScreen(){
    var screen = document.getElementById("loading-screen")
    screen.classList.toggle("load-hidden")
  }


  idleCallback (a){
    //console.log("idle Callback ->",a)
    this.refreshUserBackpack(a);
    updateBackpackData(this.user.uid,a);
  }

  onNetWorthChange(snap){
    //console.log("First",snap)
    var board = document.getElementById("board")
    var html1 = "<ol class='leaderboardList'>"
    var middle = ""
    var html2 = "</ol>"
    var keys = Object.keys(snap);
    keys.sort((a,b) => snap[b].netWorth - snap[a].netWorth);
    var sorted = keys.map(key => snap[key]);
    for (var i in sorted){
      middle+="<li>"+sorted[i].username+" : "+bitUnitConversion(sorted[i].netWorth)+"</li>"
    }
    board.innerHTML=(html1+middle+html2)
  }

  createNavigationListeners() {
    var containerList = ["create-trade-container","material-button-container","idle-purchase-container","main-inventory-container"]
    
    var buttonList = ["tradesNav","premiumNav","idlePurchaseNav","inventoryNav"]
    var current = 0;
    var currentButton = document.getElementById(buttonList[current]);
    var currentContainer = document.getElementById(containerList[current])

    hideAll();
    
    function setCurrent(index) {
      hideCurrent()
      
      current = index;

      currentButton = document.getElementById(buttonList[current]);
      console.log(current)
      currentContainer = document.getElementById(containerList[current])
      console.log(buttonList[current],containerList[current])
      currentContainer.style.display = "inline"
      currentButton.style.borderColor = "rgba(240,46,170,1)"
    }
    
    function hideAll(){
      for (var i =0;i<containerList.length;i++ ) {
        document.getElementById(containerList[i]).style.display = "none";
        document.getElementById(buttonList[i]).style.borderColor = "rgba(240, 46, 170, 0.4)"; 
      }
    }

    function hideCurrent() {
      currentContainer.style.display = "none";
      currentButton.style.borderColor = "rgba(240, 46, 170, 0.4)";
    }
    
    function getOnClick(i){
      return ()=>setCurrent(i)
    }

    for (var i = 0; i < buttonList.length; i++) {
      console.log("i:",i)
      var button = document.getElementById(buttonList[i])
      button.num = i;
      var f = getOnClick(i);
      button.addEventListener("click", f)
    }
    
  }
  
  //updates visual display of materials
  refreshUserBackpack(userBackpack){
        //console.log("refreshing",userBackpack)
        if(userBackpack){
          this.userBackpack.altConstruct(userBackpack);
        }
        //console.log(this.userBackpack)
        this.money=this.userBackpack.dict.Bit.quantity;
        //console.log("money: "+this.money)
        //TODO: change this terrible code
        var container = document.getElementById("inventory-container");
        container.innerHTML="";
        this.addMaterialDisplay();

        document.getElementById("bits").innerHTML = bitUnitConversion(this.money)

        document.getElementById("net-worth").innerHTML = "Net Worth: "+this.userBackpack.getNetWorth().toString();
  }

  //creates material buttons where you can buy materials for bits
  addMaterialButtons() {
    var container = document.getElementById("material-button-container");
    for (var material in costs) {
      var button = document.createElement("Button");
      container.appendChild(button);
      button.textContent = "Get " + material+" for: " + bitUnitConversion(costs[material])
      button.className = "material-button"
      button.addMoney = (bits) => this.addMoney(bits);
      button.price = costs[material]
      button.material = material
      button.userBackpack = this.userBackpack
      button.user = this.user;
      button.app = this
      button.onclick = function () {
        if (this.userBackpack.count("Bit") >= this.price) {
          var u =this.userBackpack
          this.userBackpack.addMaterialStack(new MaterialStack(this.material,1))
          this.addMoney(-this.price)
          updateBackpackData(this.user.uid, this.userBackpack)
          button.app.refreshUserBackpack(this.userBackpack);
        }
      }
    }
  }

  addIdleItemButtons(){
    var container = document.getElementById("idle-purchase-container");
    document.querySelectorAll('#idle-purchase-container >button').forEach(el => {
  el.parentNode.removeChild(el)
  })
document.querySelectorAll('#idle-purchase-container > .idle-description').forEach(el => {
  el.parentNode.removeChild(el)
})
    for (var material in prefabs) {
      var button = document.createElement("Button");
      var p = document.createElement("p");
      container.appendChild(button);
      p.className = "idle-description"
      p.id = "description-"+material
      //p.style.display = "none"
      container.appendChild(p)
      //TODO: change to fancy counting function
      var multiplier = this.itemBackpack.count(material)
      p.innerHTML = prefabs[material].description;
      
      var str = "";
      for (var i in prefabs[material].cost){
        var s = prefabs[material].cost[i];
        str+=""+(s.quantity+multiplier)+" "+s.type+", "
      }
      button.textContent = "Get a " + material+" for: " + str.substr(0,str.length-2)
      button.className = "idle-button"
      button.multiplier = multiplier
      button.addMoney = (material,multiplier) => {
        for (var i in prefabs[material].cost){
          var x = prefabs[material].cost[i];
          console.log("multiplier", multiplier)
          this.userBackpack.subMaterialStack(new 
          MaterialStack(x.type,x.quantity+multiplier))
        }
      };
      
      button.material = material
      button.userBackpack = this.userBackpack
      button.user = this.user;
      button.app = this
      button.onclick = function () {
        var canAffordg = true;
        for (var i in prefabs[this.material].cost){
          var x = prefabs[this.material].cost[i];
          
          if(!this.userBackpack.canAfford([new 
          MaterialStack(x.type,x.quantity+this.multiplier)])){
            canAffordg = false;
            console.log("cannot afford")
          }
        }
        if(canAffordg){
          var ib =this.app.itemBackpack
          ib.addIdleItemStack(new IdleItemStack(this.material,1))
          this.addMoney(this.material,this.multiplier);
          updateItemData(this.user.uid,ib);
          updateBackpackData(this.user.uid, this.userBackpack);
          this.app.addIdleItemButtons();
          this.app.addIdleItemDisplay()
        }
        else{
         this.app.displayError("you cannot afford this item",false);
        }
      }
      button.addEventListener("mouseover",(e)=>{
        var mat = e.target.material;
        var p = document.getElementById("description-"+mat)
        p.classList.add("open")
        console.log( "obj:", document.getElementById("description-"+mat))
      })
      button.addEventListener("mouseout",(e)=>{
        console.log(e.target.material);
        var mat = e.target.material;
        var p=document.getElementById("description-"+mat)
        p.classList.remove("open")
      })
    }
  }



  addMaterialDisplay() {
    //console.log("update material")
    var container = document.getElementById("inventory-container");
    container.innerHTML=""
    for (var material in costs) {
      //console.log(material)
      if(material=="Bit"){
        continue;
      }
      var div =document.createElement("div");
      div.className="icon-container"
      var text = document.createElement("h4");
      var img = document.createElement("img");
      img.className="inventory-icon"
      div.appendChild(text); 
      div.appendChild(img);
      container.appendChild(div);
      img.src="../../assets/icons/"+material.toLocaleLowerCase()+".png"
      if (this.userBackpack.dict[material]) {
        text.textContent = material + ": \n" + this.userBackpack.dict[material].quantity
      }
      text.className = "inventory-text"
    }
  }

  addIdleItemDisplay() {
    //console.log("update material")
    var container = document.getElementById("main-inventory-container");
    container.innerHTML=""
    for (var material in prefabs) {
      //console.log(material)
      var model = prefabs[material] 
      var div =document.createElement("div");
      div.className="idle-item-container"
      var text = document.createElement("h4");
      
      div.appendChild(text); 
      //div.appendChild(img);
      container.appendChild(div);
      
      if (this.itemBackpack.dict[material]) {
        text.innerHTML = material + ": \n" + this.itemBackpack.dict[material].quantity
      }
      text.className = "inventory-text"
    }
  }




  createTradeButtonEventListener(button,trade){
    button.addEventListener("click", ()=>{
      //(button.id)
       trade.fulfill(button.user, button.userBackpack)
       button.remove();
       this.refreshUserBackpack(this.userBackpack)
    })

  }

  //creates new trade
  //first input is what you want second is what you give
  async onCreateTradeClick(){
    //console.log("run")
    var sellerGetsSelect = document.getElementById("to-give-select");
    var buyerGetsSelect = document.getElementById("to-get-select");
    var sellerGetsNum = document.getElementById("to-give-num").value;
    var buyerGetsNum = document.getElementById("to-get-num").value;
    var getStack = new MaterialStack(buyerGetsSelect.value,parseInt(buyerGetsNum));
    var giveStack = new MaterialStack(sellerGetsSelect.value,parseInt(sellerGetsNum));
    //buyerGets sellerGets seller uid
    

    var trade = new Trade(getStack,giveStack,this.user.uid)
    //console.log(trade)
    var val = await trade.validate(this.displayError)
    console.log("validate token",val);
    if(val){
      trade.store();
      console.log("successfully validated")
      sellerGetsSelect.value="Silicon"
      buyerGetsSelect.value="Silicon"
      document.getElementById("to-give-num").value = "0"
      document.getElementById("to-get-num").value = "0"
      alert("Trade Successfully Created :)")
    }
  }
  displayError(message, val){
    
    alert(val)

    return val;
  }

  createCreateTradeSelect(){
    var sellerGetsSelect = document.getElementById("to-give-select");
    var buyerGetsSelect = document.getElementById("to-get-select");
    for (var material in costs) {
      var option1 = document.createElement("Option");
      option1.value = material;
      option1.textContent=material
      sellerGetsSelect.appendChild(option1);
      var option2 = document.createElement("Option");
      option2.value = material;
      option2.textContent=material
      buyerGetsSelect.appendChild(option2);
    }
  }

  //creates trading buttons
  async displayTradeOptions() {

    //TODO: fix bad code
    this.userData = await getUserData(this.user.uid);
    
    this.userBackpack.construct(this.userData.materials)

    this.refreshUserBackpack(this.userBackpack)
    this.rawTrades = await getTrades();
    this.trades=[];
    //console.log(this.rawTrades.length)
    for (var i=0;i<this.rawTrades.length;i++){
      var temp = new Trade();
      temp.construct(this.rawTrades[i])
      this.trades.push(temp)
    }
    var container = document.getElementById("trade-container");
    container.innerHTML="";
    var header = document.createElement("p");
      header.className="trades-header"
      header.textContent="trades"
      container.appendChild(header);
    for (var i in this.trades) {
      var trade = this.trades[i]
      if (trade.seller != this.user.uid)  {
        //console.log(trade)
        var button = document.createElement("Button");
        container.appendChild(button);
        button.textContent = "Get " + trade.buyerGets.quantity+" "+trade.buyerGets.material.type+" for: " + trade.sellerGets.quantity+" "+trade.sellerGets.material.type;
        button.className="trade-btn"
        button.id = "trade-btn-"+i;
        button.userBackpack = this.userBackpack
        button.user = this.user;
        button.num = i;
        this.createTradeButtonEventListener(button,trade);
      } else {
        var button = document.createElement("Button");
        container.appendChild(button);
        button.textContent = "You give: " + trade.buyerGets.quantity+" "+trade.buyerGets.material.type+" and get: " + trade.sellerGets.quantity+" "+trade.sellerGets.material.type;
        button.className="trade-btn"
        button.id = "trade-btn-"+i;
        button.userBackpack = this.userBackpack
        button.user = this.user;
        button.num = i;
      }
    }
  }
  //adds money and refreshes onscreen values
  addMoney(numBits) {
    this.userBackpack.addBits(numBits);
    updateBackpackData(this.user.uid, this.userBackpack)
    this.refreshUserBackpack(this.userBackpack)
  }
  //function for when main button is clicked
  onButtonUpdate() {
    this.numberController.clicks += 1
    getRandomNumberString(this.numLength);
    this.addMoney(1)
    if (Math.random() < .4) {
      this.addMoney(1)
    }
  }

}