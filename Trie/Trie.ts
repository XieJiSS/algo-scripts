import TrieNode from './TrieNode'

class Trie {
    root: TrieNode;
    constructor() {
        this.root = new TrieNode("");
    }
    insert(word: string): this {
        if(word === undefined || word.length === 0) {
            return this;
        }
        let node = this.root;
        for(let i = 0; i < word.length; i++) {
            let pos = word[i].charCodeAt(0) - "a".charCodeAt(0);
            if(node.children[pos] === undefined) {
                node.children[pos] = new TrieNode(word[i]);
                node.children[pos].count = 1;
            } else {
                node.children[pos].count += 1;
            }
            node = node.children[pos];
        }
        // after `for` finished, we need to mark node as end-of-the-word.
        // note that an end-of-the-word node may also have child nodes.
        node.isEndOfWord = true;
        return this;
    }
    insertAll(strs: string[] = []): this {
        for(let str of strs) {
            this.insert(str);
        }
        return this;
    }
    countPrefix(pfx: string = ""): number {
        if(pfx.length === 0) {
            return this.root.count;
        }
        let node = this.root;
        for(let i = 0; i < pfx.length; i++) {
            let pos = pfx[i].charCodeAt(0) - "a".charCodeAt(0);
            if(node.children[pos] === undefined) {
                return 0;
            }
            node = node.children[pos];
        }
        return node.count;
    }
    contains(word: string): boolean {
        if(word === undefined)
            return false;
        return this.countPrefix(word) >= 1;
    }
    containsAll(words: string[] = []): boolean {
        for(let word of words) {
            if(this.contains(word) === false) {
                return false;
            }
        }
        return true;
    }
    remove(word: string): this {
        if(word === undefined || word.length === 0) {
            return this;
        }
        let node = this.root;
        for(let i = 0; i < word.length; i++) {
            let pos = word[i].charCodeAt(0) - "a".charCodeAt(0);
            const childNode = node.children[pos];
            if(childNode === undefined) {
                break;
            }
            node.count -= 1;
            if(childNode.isEndOfWord && !childNode.count) {
                delete node.children[pos];
                break;
            }
            node = childNode;
        }
        return this;
    }
    removeAll(words: string[] = []): this {
        for(let word of words) {
            this.remove(word);
        }
        return this;
    }
    getWordsByPrefix(pfx: string = ""): string[] {
        let node = this.root;
        for(let i = 0; i < pfx.length; i++) {
            let pos = pfx[i].charCodeAt(0) - "a".charCodeAt(0);
            if(node.children[pos] === undefined) {
                return [];
            }
            node = node.children[pos];
        }
        return this.enumAllCombinations(node);
    }
    getWords(): string[] {
        return this.getWordsByPrefix("");
    }
    enumAllCombinations(node: TrieNode, pfx: string = ""): string[] {
        let result: string[] = [];
        if(node.children.length === 0) {
            return result;
        }
        for(let childNode of node.children) {
            if(!childNode) {
                continue;
            }
            if(childNode.isEndOfWord) {
                result.push(node.char + childNode.char);
            }
            result = result.concat(this.enumAllCombinations(childNode, node.char));
        }
        return result.map(str => pfx + str);
    }
}

export = Trie;
