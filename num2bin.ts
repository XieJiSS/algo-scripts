function toIEEE754DoubleString(v: number): string {
    return toIEEE754Double(v)
        .map(function (n: number): string {
            let m: string;
            for(m = n.toString(2); m.length < 8; m="0"+n);
            return m;
        })
        .join('')
        .replace(/(.)(.{11})(.{52})/, "$1 $2 $3")
}

function toIEEE754Double(v: number): number[] {
    var ebits = 11, fbits = 52;
    var bias = (1 << (ebits - 1)) - 1;
    var s: number, e: number, f: number;
    if (isNaN(v)) {
        e = (1 << bias) - 1; f = Math.pow(2, 51); s = 0;
    } else if (v === Infinity || v === -Infinity) {
        e = (1 << bias) - 1; f = 0; s = (v < 0) ? 1 : 0;
    } else if (v === 0) {
        e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
    } else {
        s = Number(v < 0);
        v = Math.abs(v);
        if (v >= Math.pow(2, 1 - bias)) {
            var ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
            e = ln + bias;
            f = v * Math.pow(2, -ln) * Math.pow(2, fbits) - Math.pow(2, fbits);
        } else {
            e = 0;
            f = v * Math.pow(2, bias - 1) * Math.pow(2, fbits);
        }
    }
    var i: number, bits: number[] = [];
    for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = Math.floor(f / 2); }
    for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = Math.floor(e / 2); }
    bits.push(s ? 1 : 0);
    bits.reverse();
    var str = bits.join(''), bytes: number[] = [];
    while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
    }
    return bytes;
}

export default toIEEE754DoubleString;
