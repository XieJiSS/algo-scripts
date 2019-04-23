class TrieNode {
    count: number;
    children: TrieNode[];
    isEndOfWord: boolean;
    char: string;
    /**
     * Creates an instance of TrieNode.
     * @param {String} ch currentChar
     */
    constructor(ch: string) {
        this.count = 0;
        this.children = [];
        this.isEndOfWord = false;
        this.char = ch;
    }
}

export = TrieNode;
