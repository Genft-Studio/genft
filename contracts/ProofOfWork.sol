pragma solitity ^0.8.0;

import "./FractionalExponents.sol";

contract ProofOfWork is Ownable {
    const RADIX = 65536;

    mapping(address => uint256) anchorBlock;
    mapping(address => uint256) targetFrequency;
    mapping(address => uint256) halfLife;
    mapping(address => uint8) initialTarget;
    mapping(address => uint256) claims;

    function init(uint8 _baseDifficultyBits, uint256 _targetFrequency, uint256 _halfLife) public {
        address contractAddr = msg.sender();
        anchorBlock[contractAddr] = block.number; // block height is used as a proxy for time
        targetFrequency[contractAddr] = _targetFrequency; // In blocks
        halfLife[contractAddr] = _halfLife;
        claims[contractAddr] = 0;
        // assuming starting claim number is zero
    }

    function registerClaim() public {
        claims[msg.sender()]++;
    }

    function checkWork(uint memory blockNumber, uint256 seed_) public view returns (uint256 dna) {
        bytes32 memory blockHash = blockhash(blockNumber);
        require(uint256(blockHash) != 0, 'Work expired');
        // Hash(sender + symbol + seed) yields the proof of work + DNA
        // PoW is used as entropy for the dna
        bytes32 work = keccak256(abi.encodePacked(msg.sender, symbol(), blockHash, seed_));
        require(uint256(work) <= getCurrentDifficulty, 'not enough work');

        uint256 dna = uint256(work) % 2 ** uint256(genomeBitLength);

        return dna;
    }

    function getCurrentDifficulty(address contractAddr, uint256 claims) public view returns (uint256 target) {
        // inspired by on https://upgradespecs.bitcoincashnode.org/2020-11-15-asert/
        uint _timeDelta = block.number - anchorBlock[contractAddr];
//        uint256 exp = ((_timeDelta - targetFrequency[contractAddr] * (claims + 1)) * RADIX) / halfLife[contractAddr]; // Division truncates fraction
        uint256 exp = ((_timeDelta - targetFrequency[contractAddr] * (claims + 1)) * RADIX); // Without halflife it adjusts quickly
        uint256 nextTarget = initialTarget * BancorFormula(0x0).power(2, 1, exp, 1);
    }
}
