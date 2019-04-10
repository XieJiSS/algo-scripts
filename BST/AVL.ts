//@ts-check

"use strict";

import Node from "./Node";
import BST from "./BST";

class AVL extends BST {
    /**
     * @description construct an AVL Tree instance.
     * @param {number[]} vals values to construct the AVL tree
     */
    constructor(vals) {
        super([vals[0]]);
        for(let i = 1; i < vals.length; i++) {
            this.insert(vals[i]);
        }
    }
    /**
     * @param {number} val value to insert
     */
    insert(val) {
        const insertedNode = super.insert(val);
        return this.updateBalance(insertedNode);
    }
    /**
     * @param {number} val the value of the Node to remove
     */
    remove(val) {
        const node = super.getNode(val);
        if(node === null) {
            throw new ReferenceError("val " + val + " is not found in the tree");
        }
        return this.removeNode(node);
    }
    /**
     * @param {Node} node The specific node to be removed from the tree
     * @throws `TypeError` when node === null;
     * @throws `ReferenceError` when node.parent is not the node's parent node
     * @returns the Node that replaced the removed node's position, or null
     */
    removeNode(node) {
        const parentNode = node.parent;
        const newNode = super.removeNode(node);
        if(newNode === null) {
            if(parentNode) {
                this.updateBalance(parentNode);
            }
            return newNode;
        }
        if(newNode.left)
            this.updateBalance(newNode.left);
        if(newNode.right)
            this.updateBalance(newNode.right);
        this.updateBalance(newNode);
        return newNode;
    }
    /**
     * @param {Node} modifiedNode The specific node to be removed from the tree
     * @returns the Node that has been balanced
     */
    updateBalance(modifiedNode) {
        let parentNode = modifiedNode.parent;
        if(parentNode === null) { // node is root
            parentNode = modifiedNode;
        }

        while(parentNode) {
            if(Math.abs(super.getBalance(parentNode)) >= 2) {
                const minNotBalancedNode = parentNode;
                if(super.getBalance(minNotBalancedNode) >= 2) {
                    if(super.getBalance(minNotBalancedNode.left) >= 0) {
                        super.rotateRight(minNotBalancedNode);
                    } else {
                        super.rotateLeft(minNotBalancedNode.left);
                        super.rotateRight(minNotBalancedNode);
                    }
                } else { // <= -2
                    if(super.getBalance(minNotBalancedNode.right) <= 0) {
                        super.rotateLeft(minNotBalancedNode);
                    } else {
                        super.rotateRight(minNotBalancedNode.right);
                        super.rotateLeft(minNotBalancedNode);
                    }
                }
                return modifiedNode;
            } else {
                parentNode = parentNode.parent;
            }
        }
        return modifiedNode;
    }
}

export default AVL;
