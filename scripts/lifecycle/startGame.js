import {writeUserData, updateBackpackData,getUserData,getTrades, attachTradeListener, updateUserTimeStamp, getLeaderboardListener} from "../firebaseJunk/database.js"
import {firebaseSetup,signOutUser} from "../firebaseJunk/initializeApp.js"
import {getRandomNumberString, bitUnitConversion} from "../math/functions.js"
import {RGB} from "../graphics/color.js"
import {ColorController, NumberController} from "../graphics/colorAndNumberController.js"
import {costs, Material, MaterialStack, MaterialBackpack} from "../economy/material.js"
import {Trade} from "../economy/trade.js"


export class App {
  //acts as the "main" function
  async build(){
    
    this.user = await firebaseSetup();
    await writeUserData(this.user.uid, this.user.displayName, this.user.email);
    

    this.userData = await getUserData(this.user.uid);
    var tempBackpack = new MaterialBackpack();
    tempBackpack.construct(this.userData.materials)
    this.userBackpack = tempBackpack;
    //console.log("Building...",this.userBackpack)

    
    window.addEventListener("beforeunload", ()=>updateUserTimeStamp(this.user.uid));
    this.numberController = new NumberController();
    this.numLength = 10;
    this.money = this.userBackpack.dict.Bit.quantity;
    

    document.getElementById("username").innerHTML = this.user.displayName
    this.refreshUserBackpack(this.userBackpack);

    var leaderboardListener = getLeaderboardListener(this.onNetWorthChange);


    //tests for trade fuffilment.
    this.rawTrades = await getTrades();
    this.trades=[];
    console.log(this.rawTrades.length)
    for (var i=0;i<this.rawTrades.length;i++){
      var temp = new Trade();
      temp.construct(this.rawTrades[i])
      this.trades.push(temp)
    }
    
    document.getElementById("create-trade-container").style.display = "none"
    document.getElementById("material-button-container").style.display = "inline"

    this.addMaterialButtons();
    this.displayTradeOptions();
    this.createCreateTradeSelect();
    this.createNavigationListenersPart2ElectricBoogaloo();
    //binds onButtonUpdate to click of the main button
    document.getElementById("main-button").addEventListener("click", () => this.onButtonUpdate())
    document.getElementById("sign-out-button").addEventListener("click", signOutUser)
    document.getElementById("create-trade-button").addEventListener("click",()=>this.onCreateTradeClick())
    attachTradeListener(()=>this.displayTradeOptions());
  }
  
  onNetWorthChange(snap){
    //console.log("First",snap)
    var board = document.getElementById("board")
    var html1 = "<ol>"
    var middle = ""
    var html2 = "<ol>"
    for (var i in snap){
      middle+="<li>"+snap[i].username+" : "+snap[i].netWorth+"</li>"
    }
    board.innerHTML=(html1+middle+html2)
  }

  createNavigationListeners() {
    //automate this process
    function hideAll() {
      document.getElementById("create-trade-container").style.display = "none"
      document.getElementById("material-button-container").style.display = "none"
      document.getElementById("idle-purchase-container").style.display = "none"
      document.getElementById("tradesNav").style.color = "black";
      document.getElementById("premiumNav").style.color = "black";
      document.getElementById("idlePurchaseNav").style.color = "black";
    }

    document.getElementById("tradesNav").addEventListener("click", ()=>{
      hideAll()
      document.getElementById("create-trade-container").style.display = "inline"
      document.getElementById("tradesNav").style.color = "#9D4ED0";
    })

    document.getElementById("premiumNav").addEventListener("click", ()=>{
      hideAll()
      document.getElementById("material-button-container").style.display = "inline"
      document.getElementById("premiumNav").style.color = "#9D4ED0";
    })


    document.getElementById("idlePurchaseNav").addEventListener("click", ()=>{
      hideAll()
      document.getElementById("idle-purchase-container").style.display = "inline"
      document.getElementById("idlePurchaseNav").style.color = "#9D4ED0";
    })
  }

  createNavigationListenersPart2ElectricBoogaloo() {
    var containerList = ["create-trade-container","material-button-container","idle-purchase-container"]
    var buttonList = ["tradesNav","premiumNav","idlePurchaseNav"]
    console.log("function running")
    function hideAll() {
      for (var i = 0; i < buttonList.length; i++) {
        
        document.getElementById(containerList[i]).style.display = "none"
        document.getElementById(buttonList[i]).style.color = "black";
      }
    }
    
    for (var i = 0; i < buttonList.length; i++) {

      document.getElementById(buttonList[i]).addEventListener("click", ()=>{
        
        hideAll()
        document.getElementById(containerList[i]).style.display = "inline"
        document.getElementById(buttonList[i]).style.color = "#9D4ED0";
        console.log("listener running")
      })
      console.log("checkpoint 2")
    }
    
  }
  
  //updates visual display of materials
  refreshUserBackpack(userBackpack){
        this.userBackpack=userBackpack;
        this.money=this.userBackpack.dict.Bit.quantity;
       
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
        var u =this.userBackpack
        this.userBackpack.addMaterialStack(new MaterialStack(this.material,1))
        console.log(u==this.userBackpack)
        this.addMoney(-this.price)
        updateBackpackData(this.user.uid, this.userBackpack)
        button.app.refreshUserBackpack(this.userBackpack)
      }
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
  createTradeButtonEventListener(button,trade){
    button.addEventListener("click", ()=>{
      console.log(button.id)
       trade.fulfill(button.user, button.userBackpack)
       button.remove();
       this.refreshUserBackpack(this.userBackpack)
    })

  }

  //creates new trade
  //first input is what you want second is what you give
  onCreateTradeClick(){
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
    if(trade.validate()){
      trade.store();
      console.log("successfully validated")
      sellerGetsSelect.value="Silicon"
      buyerGetsSelect.value="Silicon"
      document.getElementById("to-give-num").value = "0"
      document.getElementById("to-get-num").value = "0"
      alert("Trade Successfully Created :)")
    }
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
    var tempBackpack = new MaterialBackpack();
    tempBackpack.construct(this.userData.materials)
    this.userBackpack = tempBackpack;
    this.refreshUserBackpack(this.userBackpack)
    this.rawTrades = await getTrades();
    this.trades=[];
    console.log(this.rawTrades.length)
    for (var i=0;i<this.rawTrades.length;i++){
      var temp = new Trade();
      temp.construct(this.rawTrades[i])
      this.trades.push(temp)
    }
    var container = document.getElementById("trade-container");
    container.innerHTML="";
    for (var i in this.trades) {
      var trade = this.trades[i]
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
    }
  }
  //adds money and refreshes onscreen values
  addMoney(numBits) {
    this.userBackpack.addBits(numBits);
    updateBackpackData(this.user.uid, this.userBackpack)
    this.refreshUserBackpack(this.userBackpack)
  }
  //makes things
  onButtonUpdate() {
    //this.colorController.clicks += 1
    //this.colorController.colorClicks += 1
    this.numberController.clicks += 1
    //console.log("clicks")
    getRandomNumberString(this.numLength);
    this.addMoney(1)
    if (Math.random() < .4) {
      this.addMoney(1)
    }
  }

}