"use strict";
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
// const dir = path.resolve(path.join(__dirname, 'path/to/dir'));
// const subdir = fs.readdirSync(dir);
const lstat = util_1.promisify(fs.lstat);
const stat = util_1.promisify(fs.stat);
const readdir = util_1.promisify(fs.readdir);
/**
 * Depth-first search for a directory
 * @author JieJiSS
 * @param {String} parents
 * @param {String[]} entries sub-directories
 * @returns {Promise<string[]>} all paths
 */
async function dfs(parents, entries) {
    if(!entries) {
        entries = await readdir(parents);
    }
    let result = [];
    for (let i = 0; i < entries.length; i++) {
        const subpath = path.join(parents, entries[i]);
        if ((await lstat(subpath)).isSymbolicLink()) {
            continue;
        }
        else if ((await stat(subpath)).isDirectory()) {
            result = result.concat(await dfs(subpath, await readdir(subpath)));
        }
        else {
            result.push(path.join(parents, entries[i]));
        }
    }
    return result;
}
module.exports = dfs;
