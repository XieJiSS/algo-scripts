const revb64templ = "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA+/=";
const availableChars = revb64templ.substr(0, 62).split("").reverse().join("");
function b64(str: string) {
  let bt: number, a: number, b: number, c: number;
  let rs = "", rmn = str.length % 3;
  for (let i = 0; i < str.length;) {
    a = str.charCodeAt(i++);
    b = str.charCodeAt(i++);
    c = str.charCodeAt(i++);
    bt = (a << 16) | (b << 8) | c;
    rs += revb64templ.charAt(bt >> 18 & 63)
        + revb64templ.charAt(bt >> 12 & 63)
        + revb64templ.charAt(bt >>  6 & 63)
        + revb64templ.charAt(bt >>  0 & 63);
  }
  return !!rmn ? rs.slice(0, rmn - 3) : rs;
}
function rndChar() {
  return availableChars[~~(Math.random() * availableChars.length)];
}

function encodeText(raw: string) {
  const m = Math.max(Math.ceil(raw.length / 7), 2);
  const sliceAt = [0];
  if(raw.length <= 7) {
    sliceAt.push(1 + ~~(Math.random() * 6));
  } else {
    for(let i = 0; i < m - 1; i++) {  // m-1 cuts produce m parts
      sliceAt.push((i+1) * 7);
    }
  }
  const sliced: string[] = [];
  for(let i = 0; i < sliceAt.length; i++) {
    const start = sliceAt[i], end = sliceAt[i+1] || raw.length;
    sliced.push(raw.substring(start, end));
  }
  const cases: number[] = [], partial: string[] = [];
  for(let i = 0; i < sliced.length; i++) {
    const str = sliced[i];
    const rb64encodedText = b64(str);
    partial.push(rb64encodedText.toLowerCase());
    let chunk = "";
    for(let letter of rb64encodedText) {
      if(letter.toLowerCase() === letter) {
        chunk += "0";
      } else {
        chunk += "1";
      }
    }
    cases.push(parseInt(chunk, 2));
  }
  const special: number[] = [];
  const magicNums: number[] = [];
  for(let i = 0; i < partial.length; i++) {
    const base64Text = partial[i];
    const chunks = ["0", "0"];
    if(base64Text.includes("+")) {
    	for(let j = 0; j < base64Text.length; j++) {
        if(base64Text[j] === "+") {
          chunks[0] += "1";
          partial[i] = partial[i].slice(0, j) + rndChar() + partial[i].slice(j + 1);
        } else {
          chunks[0] += "0";
        }
      }
    }
    if(base64Text.includes("/")) {
    	for(let j = 0; j < base64Text.length; j++) {
        if(base64Text[j] === "/") {
          chunks[1] += "1";
          partial[i] = partial[i].slice(0, j) + rndChar() + partial[i].slice(j + 1);
        } else {
          chunks[1] += "0";
        }
      }
    }
    special.push(parseInt(chunks[0], 2));
    special.push(parseInt(chunks[1], 2));
    magicNums.push(parseInt(partial[i], 36));
  }
  const dataArr: number[] = magicNums.concat(special).concat(cases);
  dataArr.unshift(dataArr.length);
  const encodeResult = dataArr.map(function (num: number) {
    if(Number.isNaN(num)) {
      throw new RangeError("Input out of range! Use encodeURIComponent to escape your input.");
    }
    return num === 0 ? "" : num.toString(15);
  }).join("|");
  return encodeResult;
}

export default encodeText;
