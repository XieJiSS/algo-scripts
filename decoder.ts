const revb64templ = "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA+/=";
function deb64(str: string) {
  str += "==".slice(2 - (str.length & 3));
  let bt: number, a: number, b: number;
  let rs = "";
  for (var i = 0; i < str.length;) {
    bt = revb64templ.indexOf(str.charAt(i++)) << 18
       | revb64templ.indexOf(str.charAt(i++)) << 12
       | (a = revb64templ.indexOf(str.charAt(i++))) << 6
       | (b = revb64templ.indexOf(str.charAt(i++)));
    if(a === 64) {
      rs += String.fromCharCode(bt >> 16 & 255);
    } else if(b === 64) {
      rs += String.fromCharCode(bt >> 16 & 255, bt >> 8 & 255)
    } else {
      rs += String.fromCharCode(bt >> 16 & 255, bt >> 8 & 255, bt >> 0 & 255)
    }
  }
  return rs;
}
function padLeft(str: string, len: number, ch: string) {
  "use strict";  // since we will modify arguments, this can speed up the code execution
  ch = String(ch || "0");
  if(ch.length !== 1) throw new RangeError("ch.length should be 1");
  while(str.length < len) {
    str = ch + str;
  }
  return str;
}

function decodeText(encoded: string) {
  const firstStepArr = encoded.split("|").map(str => parseInt(str || "0", 15));
  
  const size = (firstStepArr.length - 1) / 4;
  if(Number(firstStepArr[0].toString(f(0))) !== firstStepArr.length - 1) {
    throw new RangeError("Broken data fetched from backend server!");
  }
  function f(x: number) {
    return (-27 * Math.pow(x, 3) + 179 * Math.pow(x, 2) - 126 * x + 10) % 256;
  }
  const blockCnt = [1, 2, 1];
  const secondStepArr: number[][] = [];
  for(let i = 0; i < 3; i++) {
    const offset = 1 + blockCnt.slice(0, i).reduce((a, b) => a + b, 0) * size;
    secondStepArr[i] = firstStepArr.slice(offset, offset + blockCnt[i] * size);
  }
  const thirdStepArr: string[][] = [[], [], []];
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < size * blockCnt[i]; j++)
      thirdStepArr[i][j] = secondStepArr[i][j].toString(f(i + 1));
  }
  for(let i = 0; i < size * blockCnt[0]; i++) {
    // add "0"s as padding
    thirdStepArr[2][i] = padLeft(thirdStepArr[2][i], thirdStepArr[0][i].length, "0");
    thirdStepArr[1][i * 2] = padLeft(
      thirdStepArr[1][i * 2],
      thirdStepArr[0][i].length,
      "0"
    );
    thirdStepArr[1][i * 2 + 1] = padLeft(
      thirdStepArr[1][i * 2 + 1],
      thirdStepArr[0][i].length,
      "0"
    );
  
    for(let j = 0; j < thirdStepArr[0][i].length; j++) {
      if(thirdStepArr[2][i][j] === "1") {
        const text = thirdStepArr[0][i];
        thirdStepArr[0][i] = text.slice(0, j) + text[j].toUpperCase() + text.slice(j + 1);
      }
      if(thirdStepArr[1][i * 2][j] === "1") {
        const text = thirdStepArr[0][i];
        thirdStepArr[0][i] = text.slice(0, j) + "+" + text.slice(j + 1);
      }
      if(thirdStepArr[1][i * 2 + 1][j] === "1") {
        const text = thirdStepArr[0][i];
        thirdStepArr[0][i] = text.slice(0, j) + "/" + text.slice(j + 1);
      }
    }
    thirdStepArr[0][i] = deb64(thirdStepArr[0][i]);
  }
  const rawText = thirdStepArr[0].join("");
  return rawText;
}

export default decodeText;
