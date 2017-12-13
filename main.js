const SHA256 = require("crypto-js/sha256");

class Block {

    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp +
            JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty +
            1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

let WeiCoin = new Blockchain();
console.log("Mining block 1...");
WeiCoin.addBlock(new Block(1, "17/04/2017", { amount: 4 }));
console.log("Mining block 2...");
WeiCoin.addBlock(new Block(2, "17/05/2017", { amount: 8 }));

console.log(JSON.stringify(WeiCoin, null, 4));
console.log('Blockchain valid? ' + WeiCoin.isChainValid());

//console.log('Changing a block...');
//WeiCoin.chain[1].data = { amount: 100 };
//WeiCoin.chain[1].hash = WeiCoin.chain[1].calculateHash();
//console.log("Blockchain valid? " + WeiCoin.isChainValid());
