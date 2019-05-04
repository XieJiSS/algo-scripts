'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const FOR_BROWSER = true;

const SHOULD_ESCAPE = /[\u0001-\u002f]|[\u003a-\u0040]|[\u005b-\u005e]|[\u0060]|[\u007b-\uffff]/g;

/**
 * @param {String} dir
 */
function addRightSlash(dir) {
    return dir.endsWith(path.sep) ? dir : dir + path.sep;
}
/**
 * @param {"root" | "node_modules" | "dist"} type 
 */
function getPathRegExp(type) {
    let dir = "";
    switch(type) {
        case "root":
        dir = path.resolve(path.join(__dirname, "../"));
        break;

        case "node_modules":
        dir = path.resolve(path.join(__dirname, "../node_modules/"));
        break;

        case "dist":
        dir = path.resolve(path.join(__dirname, "../dist/"));
        break;
    }
    const resultRegExpStr = addRightSlash(dir).replace(SHOULD_ESCAPE, function (str) {
        // see https://stackoverflow.com/a/13587801/10403554
        SHOULD_ESCAPE.lastIndex = 0;
        let hex = str.charCodeAt(0).toString(16);
        if(hex.length % 2 === 1) {
            hex = "0" + hex;
        }
        let chunk = "";
        for(let i = 0; i < hex.length; i += 2) {
            chunk += "\\$" + hex.substr(i, 2);
        }
        return chunk;
    });
    return new RegExp(resultRegExpStr, "g");
}

function getRootPathEscapeRegExp() {
    const seperatorRegExp = path.sep === "\\" ? /\\/g : /\//g;
    const result = path.resolve(path.join(__dirname, "../"));
    return new RegExp(
        addRightSlash(result).replace(seperatorRegExp, "\\" + path.sep),
        "g"
    );
}

async function slimify() {
    const BUNDLE_PATH = path.resolve(path.join(__dirname, "../dist/bundle.js"));
    const bundleFat  = (await readFile(BUNDLE_PATH)).toString("utf-8");
    let bundleSlim = bundleFat
        .replace(getPathRegExp("dist"),         "DIST_"       )
        .replace(getPathRegExp("node_modules"), "MODU_"       )
        .replace(getPathRegExp("root"),         "ROOT_"       );
    if(!FOR_BROWSER) {
        bundleSlim = bundleSlim.replace(getRootPathEscapeRegExp(), "." + path.sep);
    }
    await writeFile(BUNDLE_PATH, bundleSlim);
}

slimify();
