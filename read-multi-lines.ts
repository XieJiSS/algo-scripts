'use strict';

import * as readline from 'readline';

/**
 * @param {String} prompt 
 * @return {Promise<string>} A Promise that resolves with the result
 */
const getInput = (prompt: string): Promise<string> => new Promise((resolve, reject) => {
    const input: string[] = [];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: prompt
    });
    rl.prompt();
    rl.on('line', function (cmd: string) {
        input.push(cmd);
    });
    rl.once('SIGINT', function () {
        reject({
            message: 'SIGINT'
        });
    });
    rl.once('close', function () {
        const result = input.join('\n');
        resolve(result);
    });
});

module.exports = getInput;
