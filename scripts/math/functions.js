//converts bits which is a large number to other units and returns a string 
export function bitUnitConversion(numBits) {
  if (numBits < 8) {
    return numBits + " bits"
  } else if (numBits < 8000) {
    return numBits / 8 + " bytes"
  }
  var datalist = ["kilo", "mega", "giga", "tera", "peta", "exa", "zeta", "yotta","georga","neila","piga","trumpeta","cellobyte","we couldn't think of a good name-a"]
  numBits = numBits / 8
  var i = 0
  while (numBits >= 1000) {
    numBits = numBits / 1000
    i++
  }
  return numBits + " " + datalist[i - 1] + "bytes"
}

//a function that takes number of digits and returns semi-random string of x numbers 
export function getRandomNumberString(digits) {
  let res = "";
  for (var i = 0; i < digits; i++) {
    res += Math.round(Math.random() * 9).toString();
  }
  document.getElementById("main-button").innerHTML = "< " + res + " >";
  //console.log(res)
  return res;
}
