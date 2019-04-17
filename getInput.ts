import * as readline from 'readline';

/**
 * @description get user input from commad line.
 * Stop with a blank line, a Ctrl+D or a Ctrl+C.
 * Always resolves.
 */
const getInput = (prompt: string): Promise<string> => new Promise(resolve => {
    const input = [];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: prompt
    });
    rl.prompt();
    rl.on('line', function (cmd) {
        if(cmd.trim() === '') {
            rl.close();
        }
        input.push(cmd);
    });
    rl.once('SIGINT', function () {
        resolve(input.join('\n'));
    });
    rl.once('close', function () {
        resolve(input.join('\n'));
    });
});

export = getInput;
