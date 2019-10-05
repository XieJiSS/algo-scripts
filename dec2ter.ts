function dec2ter1(decnum: number): string {
  let res = "", i = 0;
  while(3 ** i <= decnum) {
    const chunk = String(Math.floor(decnum / (3 ** i)) % 3);
    res = chunk + res;
    i += 1;
  }
  return res;
}

function dec2ter2(decnum: number): string {
  let res = "";
  const highest = Math.floor(Math.log(decnum) / Math.log(3));
  for(let i = highest; i >= 0; i--) {
    const chunk = Math.floor(decnum / (3 ** i));
    decnum -= chunk * (3 ** i);
    res += String(chunk);
  }
  return res;
}

function dec2ter3(decnum: number): string {
  let res = "", i = 0;
  while(3 ** i <= decnum) {
    const chunk = Math.floor(decnum % (3 ** (i+1)) / (3 ** i));
    res = String(chunk) + res;
    i += 1;
  }
  return res;
}

console.log(dec2ter1(96));
console.log(dec2ter2(96));
console.log(dec2ter3(96));

export default {
  dec2ter1,
  dec2ter2,
  dec2ter3,
};
