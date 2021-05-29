import * as Ethers from "ethers"
import and from 'bitwise-buffer/src/and.js'
import lshift from 'bitwise-buffer/src/leftShift.js'
import rshift from 'bitwise-buffer/src/rightShift.js'
import { exposeWorker } from 'react-hooks-worker';
import {Buffer} from "buffer";

function randomBuffer(){
    var x = new Uint8Array(32);
    for(var i = 0; i < 32; i++){
        x[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(x);
}

function isZero(b) {
    let i = b.length
    let result = 0;

    while (i--) {
        result |= b[i];
    }
    return !result
}

const mine = ([salt, difficultyBits, dnaBits, address]) => {
    const difficultyMask = Buffer.from(new Uint8Array(32))
    rshift.mutate(difficultyMask, difficultyBits, 1)

    const dnaMask = Buffer.from(new Uint8Array(32))
    lshift.mutate(dnaMask, dnaBits, 1)

    let guess, hash;
    var count = 0;
    var startTime = Date.now();
    while (true){
        ++count;
        // if (!((count) % 1000)) console.log(count)
        guess = randomBuffer();

        const hashHex = Ethers.utils.solidityKeccak256(
            ['address', 'string', 'uint256'],
            [address, salt, guess]
        )
        hash = Buffer.from(hashHex.slice(2), 'hex')
        if (isZero(and.pure(hash, difficultyMask))) {
            break
        }
    }
    var rawTime = (Date.now() - startTime)/1000
    var time = Math.floor(rawTime);
    var khs = Math.round(count/rawTime/1000);
    var dna = Buffer.from(and.pure(hash, dnaMask).slice(-Math.ceil(dnaBits / 8)))
    return {
        seed: guess.toString('hex'),
        dna: dna.toString('hex'),
        time,
        hash: hash.toString('hex'),
        hashes: count,
        khs
    }
}

exposeWorker(mine)

// const testAddress = '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'
// let result = mine('$OWL', 20, 32, testAddress)
//
// console.log('seed:', result.seed.toString('hex'))
// console.log('hash:', result.hash.toString('hex'))
// console.log('dna:', result.dna.toString('hex'))
// console.log('address:', '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'.slice(2))
// console.log('difficulty bits:', result.difficultyBits)
// console.log('dna bits:', result.dnaBits)
// console.log('salt:', result.salt)
// console.log('duration:', result.time)
// console.log('hashes:', result.hashes)
// console.log(`Speed: ${result.khs}kh/s`)


// seed: e6b2d7a64491e7544051cb9906851bdc2258944d8651c7fbd2b90a2eae8c6600
// hash: 000092402e1010955f5fbdde21834684afa23a0dcaf065b704e12a581d09d748
// dna: 1d09d748
// address: 534Eb19E729E955308e5A9c37c90d4128e0F450F
// difficulty bits: 16
// dna bits: 32
// salt: $OWL