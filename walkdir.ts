import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// const dir = path.resolve(path.join(__dirname, 'path/to/dir'));
// const subdir = fs.readdirSync(dir);

const lstat    = promisify(fs.lstat);
const stat     = promisify(fs.stat);
const readdir  = promisify(fs.readdir);

/**
 * Depth-first search for a directory
 * @author JieJiSS
 * @param {String} parents
 * @param {String[]} entries sub-directories
 * @returns {Promise<string[]>} all paths
 */
async function dfs(parents: string, entries: string[]): Promise<string[]> {
  let result: string[] = [];
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

// dfs(dir, subdir).then(p => console.log(p));

export = dfs;
