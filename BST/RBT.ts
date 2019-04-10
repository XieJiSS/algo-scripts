//@ts-check

"use strict";

import RBNode from "./RBNode";

class RBT {
    /**
     * @description construct a Red Black Tree instance.
     * @param {number[]} vals values to construct the RBT tree
     */
    root: RBNode;
    constructor(vals) {
        /**
         * @type {RBNode}
         */
        this.root = new RBNode(vals[0] || null, null, "black");
        for(let i = 1; i < vals.length; i++) {
            this.insert(vals[i]);
        }
    }
    /**
     * @param {number} val value to insert
     * @warning If the value to be inserted already exists, then this method will return that existed node.
     * @returns {RBNode} the inserted Node
     */
    insert(val) {
        if(this.root.val === null) {
            this.root.val = val;
            this.root.color = "black";
            return this.root;
        }
        let node = this.root;
        const insertedNode = new RBNode(val, node, "red");
        while(true) {
            if(val > node.val) {
                if(node.right) {
                    node = node.right;
                } else {
                    node.right = insertedNode;
                    insertedNode.parent = node;
                    break;
                }
            } else if(val < node.val) {
                if(node.left) {
                    node = node.left;
                } else {
                    node.left = insertedNode;
                    insertedNode.parent = node;
                    break;
                }
            } else {
                return node;
            }
        }
        if(!insertedNode.isValidRBNode()) {
            // in this case, insertedNode.parent can't be root
            this.updateColor(insertedNode);
        }
        return insertedNode;
    }
    /**
     * @param {number} val the value of the node to get
     */
    getNode(val) {
        let node = this.root;
        while(node !== null && node.val !== val) {
            if(val > node.val) {
                node = node.right;
            } else {
                node = node.left;
            }
        }
        return node;
    }
    /**
     * @returns {number} depth
     */
    depth() {
        return this.getNodeDepth(this.root);
    }
    /**
     * @param {RBNode} node The specific node to get its max depth
     * @returns {number} depth
     */
    getNodeDepth(node) {
        if(node === null) return 0;
        return 1 + Math.max(this.getNodeDepth(node.left), this.getNodeDepth(node.right));
    }
    /**
     * @param {RBNode} node The node to rotate around
     * @description Usage: `bstInstance.rotateLeft(node);`
     * @warning Don't call this function if you aren't sure what you are doing.
     * @throws `TypeError` when node.right === null;
     * @throws `ReferenceError` when node.parent is not the node's parent node
     */
    rotateLeft(node) {
        const rightNode = node.right;
        if(rightNode === null) {
            throw new TypeError("The right node of given node is null");
        }
        node.right = null;

        const rightNodeLeft = rightNode.left;
        rightNode.left = node;
        node.right = rightNodeLeft;

        const parentNode = node.parent;
        node.parent = rightNode;
        if(node.right)
            node.right.parent = node;

        if(parentNode === null) {
            if(this.root === node) {
                this.root = rightNode;
            } else {
                throw new ReferenceError("node.parent is null and node is not root node");
            }
        } else {
            if(parentNode.left === node) {
                parentNode.left = rightNode;
            } else if(parentNode.right === node) {
                parentNode.right = rightNode;
            } else {
                throw new ReferenceError("node.parent is not the node's parent");
            }
        }
        
        rightNode.parent = parentNode;
        return this;
    }
    /**
     * @param {RBNode} node The node to rotate around
     * @description Usage: `bstInstance.rotateRight(node);`
     * @warning Don't call this function if you aren't sure what you are doing.
     * @throws `TypeError` when node.left === null;
     * @throws `ReferenceError` when node.parent is not the node's parent node
     */
    rotateRight(node) {
        const leftNode = node.left;
        if(leftNode === null) {
            throw new TypeError("The right node of given node is null");
        }
        node.left = null;

        const leftNodeRight = leftNode.right;
        leftNode.right = node;
        node.left = leftNodeRight;

        const parentNode = node.parent;
        node.parent = leftNode;
        if(node.left)
            node.left.parent = node;

        if(parentNode === null) {
            if(this.root === node) {
                this.root = leftNode;
            } else {
                throw new ReferenceError("node.parent is null and node is not root node");
            }
        } else {
            if(parentNode.left === node) {
                parentNode.left = leftNode;
            } else if(parentNode.right === node) {
                parentNode.right = leftNode;
            } else {
                throw new ReferenceError("node.parent is not the node's parent");
            }
        }
        
        leftNode.parent = parentNode;
        return this;
    }
    /**
     * @param {number} val the value of the Node to remove
     */
    remove(val) {
        const node = this.getNode(val);
        if(node === null) {
            throw new ReferenceError("val " + val + " is not found in the tree");
        }
        return this.removeNode(node);
    }
    /**
     * @param {RBNode} node The specific node to be removed from the tree
     * @throws `TypeError` when node === null;
     * @throws `ReferenceError` when node.parent is not the node's parent node
     * @returns the Node that replaced the removed node's position, or null
     */
    removeNode(node) {
        if(node === null) {
            throw new TypeError("node is null");
        }
        const parentNode = node.parent;
        if(node.parent === null) {
            if(node === this.root) {
                this.root = node.left;
                node.left.parent = null;
                const leftNodeRight = node.left.right;
                node.left.right = node.right;
                node.left.right.parent = node.left;
                node.left = null;
                const rightNode = node.right;
                node.right = null;
                let rightNodeLeftLeaf = rightNode;
                while(rightNodeLeftLeaf && rightNodeLeftLeaf.left) {
                    rightNodeLeftLeaf = rightNodeLeftLeaf.left;
                }
                rightNodeLeftLeaf.left = leftNodeRight;
                if(leftNodeRight)
                    leftNodeRight.parent = rightNodeLeftLeaf;
                return this.root;
            } else {
                throw new TypeError("node has no parent and is not root");
            }
        }
        if(node.parent.left !== node && node.parent.right !== node) {
            throw new ReferenceError("node.parent is not the node's parent");
        }
        if(node.parent.left === node) {
            const rightNode = node.right;
            let rightNodeLeftLeaf = rightNode;
            while(rightNodeLeftLeaf && rightNodeLeftLeaf.left) {
                rightNodeLeftLeaf = rightNodeLeftLeaf.left;
            }
            node.parent.left = rightNode;
            if(rightNode)
                rightNode.parent = node.parent;
            node.parent = null;
            
            if(rightNodeLeftLeaf)
                rightNodeLeftLeaf.left = node.left;
            if(node.left)
                node.left.parent = rightNodeLeftLeaf;
            node.left = null;
            return parentNode.left;
        } else {
            const leftNode = node.left;
            let leftNodeRightLeaf = leftNode;
            while(leftNodeRightLeaf && leftNodeRightLeaf.right) {
                leftNodeRightLeaf = leftNodeRightLeaf.right;
            }
            node.parent.right = leftNode;
            if(leftNode)
                leftNode.parent = node.parent;
            node.parent = null;

            if(leftNodeRightLeaf)
                leftNodeRightLeaf.right = node.right;
            if(node.right)
                node.right.parent = leftNodeRightLeaf;
            node.right = null;
            return parentNode.right;
        }
    }
    inOrder() {
        return this.getValues(this.root, "inOrder");
    }
    preOrder() {
        return this.getValues(this.root, "preOrder");
    }
    postOrder() {
        return this.getValues(this.root, "postOrder");
    }
    /**
     * @param {RBNode} node
     * @param {"inOrder" | "preOrder" | "postOrder"} type recurssion method
     * @returns {number[]} values
     */
    getValues(node, type) {
        if(node === null) return [];
        switch(type) {
        case "inOrder":
            return [...this.getValues(node.left, type), node.val, ...this.getValues(node.right, type)];
        case "preOrder":
            return [node.val, ...this.getValues(node.left, type), ...this.getValues(node.right, type)];
        case "postOrder":
            return [...this.getValues(node.left, type), ...this.getValues(node.right, type), node.val];
        default:
            throw new RangeError("Invalid recurssion order: should be inOrder | preOrder | postOrder");
        }
    }
    /**
     * @param {RBNode} modifiedNode
     * @warning Don't call this method unless you know what you're doing.
     * @throws `RangeError` if `modifiedNode` is null or `modifiedNode` is colored black.
     */
    updateColor(modifiedNode) {
        if(modifiedNode === null || modifiedNode.color === "black") {
            throw new RangeError("Wrong color for modifiedNode: expecting red, got black");
        }
        // modified node's color is red, and is not a valid RBNode
        const parentNode = modifiedNode.parent; // red
        const grandparentNode = parentNode.parent; // must be black
        /**
         * @type {RBNode}
         */
        let uncleNode;
        if(grandparentNode.left && grandparentNode.left !== parentNode) {
            uncleNode = grandparentNode.left;
        } else if(grandparentNode.right && grandparentNode.right !== parentNode) {
            uncleNode = grandparentNode.right;
        }
        /**
         * @type {string}
         */
        let uncleNodeColor;
        if(uncleNode) {
            uncleNodeColor = uncleNode.color;
        } else {
            uncleNodeColor = "black"; // the color of null is black
        }
        if(uncleNodeColor === "red") {
            parentNode.color = "black";
            uncleNode.color = "black";
            grandparentNode.color = "red";
            if(this.root === grandparentNode) {
                grandparentNode.color = "black"; // root should be black, and still a valid RBT
            }
            if(!grandparentNode.isValidRBNode()) {
                this.updateColor(grandparentNode);
            }
            return;
        }
        // so uncle node's color is black
        if(modifiedNode === parentNode.right && parentNode === grandparentNode.left) {
            this.rotateLeft(parentNode); // so that modifiedNode becomes parentNode's parent
            if(!parentNode.isValidRBNode()) {
                this.updateColor(parentNode);
            }
            return;
        } else if(modifiedNode === parentNode.left && parentNode === grandparentNode.right) {
            this.rotateRight(parentNode);
            if(!parentNode.isValidRBNode()) {
                this.updateColor(parentNode);
            }
            return;
        }
        
        if(modifiedNode === parentNode.left && parentNode === grandparentNode.left) {
            this.rotateRight(grandparentNode); // so that parentNode becomes grandparentNode's parent
            // swap the color
            parentNode.color = "black";
            grandparentNode.color = "red";
            return;
        } else if(modifiedNode === parentNode.right && parentNode === grandparentNode.right) {
            this.rotateLeft(grandparentNode);
            parentNode.color = "black";
            grandparentNode.color = "red";
            return;
        }
    }
}

export default RBT;
