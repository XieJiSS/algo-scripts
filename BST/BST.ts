//@ts-check

"use strict";

import Node from "./Node";

class BST {
    /**
     * @description construct a BST instance.
     * @param {number[]} vals values to construct the BST tree
     */
    root: Node;
    constructor(vals) {
        /**
         * @type {Node}
         */
        this.root = new Node(vals[0], null);
        for(let i = 1; i < vals.length; i++) {
            this.insert(vals[i]);
        }
    }
    /**
     * @param {number} val value to insert
     * @returns {Node} the inserted Node
     */
    insert(val) {
        if(this.root.val === null) {
            this.root.val = val;
            return this.root;
        }
        let node = this.root;
        const insertedNode = new Node(val, node);
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
     * @param {Node} node The specific node to get its `left-right` balance
     */
    getBalance(node) {
        if(node.val === null) {
            return 0;
        }
        return this.getNodeDepth(node.left) - this.getNodeDepth(node.right);
    }
    /**
     * @returns {number} depth
     */
    depth() {
        return this.getNodeDepth(this.root);
    }
    /**
     * @param {Node} node The specific node to get its max depth
     * @returns {number} depth
     */
    getNodeDepth(node) {
        if(node === null) return 0;
        return 1 + Math.max(this.getNodeDepth(node.left), this.getNodeDepth(node.right));
    }
    /**
     * @param {Node} node The node to rotate around
     * @description Usage: `bstInstance.rotateLeft(node);`
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
     * @param {Node} node The node to rotate around
     * @description Usage: `bstInstance.rotateRight(node);`
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
     * @param {Node} node The specific node to be removed from the tree
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
                this.root = node.left || new Node(null, null);
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
     * @param {Node} node
     * @param {string} type inOrder | preOrder | postOrder
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
}

export default BST;
