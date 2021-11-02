  import { getDatabase, ref, get, set, update } m tps://www.gstatic.com/firebasejs/9.0.0/firebase-datab.js';
 import { firebaseSetup, signOutUser } from initializeApp.js"
 import { firebaseSetup, signOutUser } from scripts/firebaseJunk/initializeApp.js"
 
 import { RGB } from "./color.js"
 import { RGB } from "./scripts/graphics/color.js"
 
 var user = await firebaseSetup();
 await writeUserData(user.uid, user.displayName, r.email);
 var userData = await getUserData(user.uid);
- var backgroundColor = new RGB(0, 0, 0);
- var numLength = 10;
- var money = userData.clicks;
- var needsNewTarget = true;
- var colorClicks = 0;
- document.getElementById("username").innerHTML = r.displayName
- document.getElementById("bits").innerHTML = UnitConversion(money)
- //console.log(user)20	- //writes new user async function writeUserData(userId, name, email)    //check if user exists
  const db = getDatabase();   var x = await get(ref(db, 'users/' + userId))   //console.log(x)   if (!x.exists()) {     await set(ref(db, 'users/' + userId), {       username: name,       email: email,
      clicks: 0     });   } } function updateClickData(userId, clicks) {   const db = getDatabase();   update(ref(db, 'users/' + userId), {     clicks: clicks   }); }
42	- function getUserData(userId) {
43	-   const db = getDatabase();
44	-   return new Promise((res) => {
45	-     get(ref(db, 'users/' + userId))
46	-       .then((x) => res(x.val())).catch(err => res(err))
47	-   });
48	- }
49	-
50	- function addMoney(numBits) {
51	-   money++;
52	-   //console.log(money);
53	-   updateClickData(user.uid, money)
54	-   document.getElementById("bits").innerHTML = bitUnitConversion(money)
55	-
56	- }
57	-
58	- function getRandomNumberString(digits) {
59	-   let res = "";
60	-   for (var i = 0; i < digits; i++) {
61	-     res += Math.round(Math.random() * 9).toString();
62	-   }
63	-   document.getElementById("main-button").innerHTML = "< " + res + " >";
64	-   return res;
65	- }
66	-
67	- function onButtonUpdate() {
68	-   clicks += 1
69	-   colorClicks += 1
70	-   getRandomNumberString(numLength);
71	-   addMoney(1)
72	-   if (Math.random() < .4) {
73	-     addMoney(1)
74	-   }
75	- }
76	- function getSpinyClickThingy(ms) {
77	-   return setInterval(() => getRandomNumberString(numLength), ms)
78	- }
79	-
80	-
81	- var clicks = 1;
82	- var slowestSpeed = 2000;
83	- var maxChange = 40;
84	- var colorShiftThreshold = 5;
85	- var updateSpeed = slowestSpeed
86	- var spinyClickThingy = getSpinyClickThingy(updateSpeed)
87	- var colorChange = slowestSpeed;
88	- var maxColorChange = 4;
89	- backgroundColor.chooseRandomTarget()
90	-
91	- function colorShift(updateSpeed) {
92	-   //console.log(updateSpeed)
93	-   backgroundColor.shiftTowardTarget(updateSpeed);
94	-   var buttonBackground = document.getElementsByClassName("mining-container")[0];
95	-   buttonBackground.style.backgroundColor = backgroundColor;
96	-   //console.log(buttonBackground);
97	- }
98	-
99	- var clickCounter = setInterval(() => {
100	-   var newUpdateSpeed = 1 / clicks * 400
101	-
102	-   //makes gradual slowing down effect
103	-   if (newUpdateSpeed > updateSpeed && newUpdateSpeed > updateSpeed + maxChange) {
104	-     newUpdateSpeed = updateSpeed + maxChange;
105	-   }
106	-   if (newUpdateSpeed > slowestSpeed) {
107	-     newUpdateSpeed = slowestSpeed;
108	-   }
109	-
110	-   updateSpeed = newUpdateSpeed;
111	-   clearInterval(spinyClickThingy);
112	-   spinyClickThingy = getSpinyClickThingy(updateSpeed)
113	-
114	-   clicks = 1
115	-   //console.log("new spiny click",updateSpeed)
116	- }, slowestSpeed + 1)
117	-
118	- function colorController() {
119	-   
120	-   document.getElementById("color-clicks-chart").innerHTML = colorClicks;
121	-   if (colorClicks <= colorShiftThreshold) {
122	-     backgroundColor.chooseRandomTarget()
123	-     colorClicks = 2;
124	-   } else {
125	-     colorShift(colorClicks);
126	-     colorClicks = (colorClicks ** .999 );
127	-     
128	-   }
129	-
130	- }
131	-
132	- var colorControlTimer = setInterval(colorController, 10)
133	-
134	- function bitUnitConversion(numBits) {
135	-   if (numBits < 8) {
136	-     return numBits + " bits"
137	-   } else if (numBits < 8000) {
138	-     return numBits / 8 + " bytes"
139	-   }
140	-   var datalist = ["kilo", "mega", "giga", "tera", "peta", "exa", "zeta", "yotta"]
141	-   numBits = numBits / 8
142	-   var i = 0
143	-   while (numBits >= 1000) {
144	-     numBits = numBits / 1000
145	-     i++
146	-   }
147	-   return numBits + " " + datalist[i - 1] + "bytes"
148	- }
149	-
150	- //binds onButtonUpdate to click of the main button
151	- document.getElementById("main-button").addEventListener("click", onButtonUpdate)
152	- document.getElementById("sign-out-button").addEventListener("click", signOutUser)

The Actual Big Advanced Project - Replit