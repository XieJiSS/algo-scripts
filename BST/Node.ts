"use strict";

class Node {
    /**
     * @param {number} val value
     * @param {Node | null} parent parentNode
     */
    val: number;
    parent?: Node;
    left?: Node;
    right?: Node;
    constructor(val, parent) {
        this.val = val;
        this.parent = parent || null;
        this.left = null;
        this.right = null;
    }
}

export default Node;
