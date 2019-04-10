"use strict";

const readline = require('readline');

/**
 * @param {String} prompt 
 * @return {Promise<string>} A Promise that resolves with the result
 */
const getInput = prompt => new Promise((resolve, reject) => {
    const input = [];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: prompt
    });
    rl.prompt();
    rl.on('line', function (cmd) {
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
