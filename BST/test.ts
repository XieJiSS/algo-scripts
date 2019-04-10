//@ts-check

interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

"use strict";

const usedNumbers = [];
function getRandomUniqueNumber(): number {
    let num: number;
    do {
        num = ~~(Math.random() * 90 + 1);
    } while(usedNumbers.indexOf(num) !== -1);
    usedNumbers.push(num);
    return num;
}

const assert = require("assert");
const cp = require("child_process");
import Node from "./Node";
import RBNode from "./RBNode";
import BST from "./BST";
import AVL from "./AVL";
import RBT  from "./RBT";
const fs = require("fs");
const path = require("path");

const startTime = Date.now();

const arr = Array.from(new Array(40), () => getRandomUniqueNumber());
const rbt = new RBT(arr);
console.log(arr);

beautifyRBTree(rbt);

// avl.insert(8);
// avl.remove(usedNumbers[0]);
// avl.remove(usedNumbers[8]);
//avl.remove(usedNumbers[3]);

// console.log("Test finished in", Date.now() - startTime, "ms");

// beautifyTree(avl);

/**
 * @param {BST | AVL} bst the Binary Search Tree
 */
function beautifyTree(bst) {
    let str = "graph {\n";
    str += mapBSTNode(bst.root);
    str += "}";
    fs.writeFileSync("result.txt", str);
    fs.writeFileSync("tree.png", cp.execSync("dot -Tpng result.txt"));
    return;
    const values = bst.preOrder();
    fs.writeFileSync(path.join(__dirname, "output-tree-data.js"), `var values = [${values.join(",")}]`);
}

/**
 * @param {RBT} rbt the Red-Black Binary Search Tree
 */
function beautifyRBTree(rbt) {
    let str = "graph {\nnode[fontname=Courier];\n";
    str += mapRBTNode(rbt.root);
    str += "}";
    fs.writeFileSync("result.txt", str);
    fs.writeFileSync("tree.png", cp.execSync("dot -Tpng result.txt"));
    return;
}

/**
 * @param {Node} node
 */
function mapBSTNode(node) {
    let str = "";
    if(node.left) {
        str += `  ${node.val} -- ${node.left.val}\n`;
        str += mapBSTNode(node.left);
    }
    if(node.right) {
        str += `  ${node.val} -- ${node.right.val}\n`;
        str += mapBSTNode(node.right);
    }
    return str;
}

/**
 * @param {RBNode} node
 */
function mapRBTNode(node) {
    let str = "";
    const DEF = "fontcolor=gray, style=filled, height=.1, shape=point, color=gray";
    if(node.left) {
        str += `  ${node.val}[fontcolor=white, color=${node.color}, style=filled];\n` +
               `  ${node.left.val}[fontcolor=white, color=${node.left.color}, style=filled];\n` +
               `  ${node.val} -- ${node.left.val};`;
        str += mapRBTNode(node.left);
    } else {
        str += `  ${node.val}[fontcolor=white, color=${node.color}, style=filled];\n` +
               `  ${node.val-0.5}[${DEF}];\n` +
               `  ${node.val} -- ${node.val-0.5};`;
    }
    if(node.right) {
        str += `  ${node.val}[fontcolor=white, color=${node.color}, style=filled];\n` +
               `  ${node.right.val}[fontcolor=white, color=${node.right.color}, style=filled];\n` +
               `  ${node.val} -- ${node.right.val};`;
        str += mapRBTNode(node.right);
    } else {
        str += `  ${node.val}[fontcolor=white, color=${node.color}, style=filled];\n` +
               `  ${node.val+0.5}[${DEF}];\n` +
               `  ${node.val} -- ${node.val+0.5};`;
    }
    return str;
}
