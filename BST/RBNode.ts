//@ts-check

"use strict";

class RBNode {
    /**
     * @param {number} val value
     * @param {RBNode | null} parent parentNode
     * @param {"red" | "black"} color the color of the Node, red | black
     */
    val: number;
    parent?: RBNode;
    left?: RBNode;
    right?: RBNode;
    color: "red" | "black";
    constructor(val, parent, color) {
        if(color !== "red" && color !== "black") {
            throw new RangeError("color should be either black or red");
        }
        this.val = val;
        this.parent = parent || null;
        this.left = null;
        this.right = null;
        this.color = color;
    }
    isValidRBNode() {
        if(this.color === "red") {
            if(this.parent.color === "red") {
                return false;
            }
        }
        return true;
    }
}

export default RBNode;
