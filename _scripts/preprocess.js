'use strict';
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const dir = path.resolve(path.join(__dirname, '../dist'));
const subdir = fs.readdirSync(dir);

const lstat     = promisify(fs.lstat);
const stat      = promisify(fs.stat);
const readdir   = promisify(fs.readdir);
const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const { writeFileSync } = fs;

const mods = [];

/**
 * @param {String[]} modules 
 */
function generateIndex(modules) {
  let bodyStr = '';
  for(let i = 0; i < modules.length; i++) {
    const moduleName = modules[i];
    bodyStr += `const ${namify(moduleName)} = require("./${moduleName}.js");\n`;
  }
  bodyStr += '\nmodule.exports = {\n';
  for(let i = 0; i < modules.length; i++) {
    const moduleName = modules[i];
    bodyStr += `  ${namify(moduleName)},\n`;
  }
  bodyStr += '};';
  return bodyStr;
}

/**
 * @param {String} md 
 */
function namify(md) {
  if(md.includes('-')) {
    const arr = md.split('-');
    return arr.map(str => (str[0] || '').toUpperCase() + str.substr(1)).join('');
  }
  return md;
}

/**
 * Depth-first search for a directory
 * @author JieJiSS
 * @param {String} parents
 * @param {String[]} entries sub-directories
 * @returns {Promise<string[]>} all paths
 */
async function dfs(parents, entries) {
  let result = [];
  for(let i = 0; i < entries.length; i++) {
    const subpath = path.join(parents, entries[i]);
    if((await lstat(subpath)).isSymbolicLink()) {
      continue;
    } else if((await stat(subpath)).isDirectory()) {
      result = result.concat(await dfs(subpath, await readdir(subpath)));
    } else {
      result.push(path.join(parents, entries[i]));
    }
  }
  return result;
}

dfs(dir, subdir).then(async p => {
  await Promise.all(p.map(async rawPath => {
    let p = String(rawPath).replace(/\\/g, '/');
    if(p.endsWith('.js')) {
      const code = (await readFile(p)).toString('utf-8');
      // let EOL = code.includes('\r\n') ? '\r\n' : '\n';
      const fname = p.substring(p.lastIndexOf('/') + 1, p.indexOf('.js'));
      if(fname !== 'index' && fname !== 'bundle')
        mods.push(fname);
      // await writeFile(p, `/// <reference path="${fname}.d.ts"/>${EOL}${code}`);
    }
  }));
  writeFileSync(dir + '/index.js', generateIndex(mods));
});
