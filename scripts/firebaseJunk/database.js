import { getDatabase, ref, get, set, update, remove, onValue,query,orderByChild,limitToLast, startAfter } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

import {MaterialBackpack} from "../economy/material.js"
//writes new user
export async function writeUserData(userId, name, email) {
  //check if user exists
  const db = getDatabase();
  var x = await get(ref(db, 'users/' + userId))
  //console.log(x)
  var backpack = new MaterialBackpack();
  if (!x.exists()) {
    await set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      materials: backpack.toJSON(),
      idleItems: [],
      netWorth:0
    });
  }
}

export function getLeaderboardListener(callback){
  
  const db = getDatabase();
  var r = ref(db, "users/");
 var q = query(r, orderByChild("netWorth"), startAfter(false),limitToFirst(3))
 onValue(q, function(snapshot) {
      //console.log(snapshot.val());
      callback(snapshot.val())
    });
}

export function updateUserTimeStamp(userId){
  const db = getDatabase();
  //alert(userId)
  update(ref(db, 'users/' + userId), {
    logOutTime:Date.now()
  });
}
export function updateBackpackData(userId, backpack) {
  const db = getDatabase();
  //console.log(userId, backpack)
  update(ref(db, 'users/' + userId), {
    materials: backpack,
    netWorth:backpack.getNetWorth()
  });
}

export function getUserData(userId) {
  const db = getDatabase();
  return new Promise((res) => {
    get(ref(db, 'users/' + userId))
      .then((x) => res(x.val())).catch(err => res(err))
  });
}


export async function addTrade(trade) {
  //check if user exists
  const db = getDatabase();
  var x = await get(ref(db, 'market/trades/' + trade.id))
  //console.log(x)
  if (!x.exists()) {
    await set(ref(db, 'market/trades/' + trade.id), trade.toJSON());
  }
}


export async function deleteTrade(trade){
  const db = getDatabase();
  await set(ref(db, 'market/trades/' + trade.id), null);

}

export function attachTradeListener(callback){
  const db = getDatabase();
  const starCountRef = ref(db, 'market/trades');
  onValue(starCountRef, (snapshot) => {
    console.log("value changed")
    callback()
  });
}
export async function getTrades(){
  const db = getDatabase();
  return new Promise((res)=>{
    const dbRef = ref(db, '/market/trades');
    //console.log(tradesRef)
    var resultArray = [];
    onValue(dbRef, (snapshot) => {
      //console.log(snapshot)
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        //console.log(childData);
        resultArray.push(childData);
        // ...
      });
      res(resultArray)
    }, {
      onlyOnce: true
    });
    
  })
}