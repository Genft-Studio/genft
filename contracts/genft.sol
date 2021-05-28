// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Genft is ERC721URIStorage, Ownable {
    using Strings for string;

    event TokenMinted(uint256 amountPaid, uint256 dna);
    event TokenBurned(uint256 dna);

    uint256 public difficulty1Target;
    uint8 public genomeBitLength;
    uint256 public firstPrice;
    uint256 public priceIncrement;
    address payable public artistAddress;
    string public uiConfigUri;

    struct Token {
        uint256 dna;
    }

    mapping(uint256 => uint256) byDna; // dna must be unique

    Token[] public tokens;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _genomeBitLength,
        uint256 _firstPrice,
        uint256 _priceIncrement,
        string memory _uiConfigUri
    ) ERC721(_tokenName, _tokenSymbol) Ownable()
    {
        difficulty1Target = 2 ** (256 - uint256(_minimumDifficultyBits)) - 1;
        genomeBitLength = _genomeBitLength;
        firstPrice = _firstPrice;
        priceIncrement = _priceIncrement;
        artistAddress = payable(msg.sender);
        uiConfigUri = _uiConfigUri;
    }

    function setArtistAddress(address payable newArtist_) public onlyOwner {
        artistAddress = newArtist_;
    }

    function mint(
        uint256 seed_,
        string memory tokenUri_
    ) payable public {
        uint256 newTokenIndex = tokens.length;

        uint price = _getMintPrice(newTokenIndex);
        require(msg.value >= price, 'not enough paid');

        // Hash(sender + symbol + seed) yields the proof of work + DNA
        // PoW is used to introduce randomness, so that the minter can see it before they mint
        bytes32 work = keccak256(abi.encodePacked(msg.sender, symbol(), seed_));
        require(uint256(work) <= difficulty1Target, 'not enough work');

        artistAddress.transfer(price);

        // return change
        uint256 change = msg.value + price;
        address payable changeAddress = payable(msg.sender);
        changeAddress.transfer(change);

        uint256 dna = uint256(work) % 2 ** uint256(genomeBitLength);

        tokens.push(
            Token(dna)
        );
        byDna[dna] = newTokenIndex;

        _safeMint(msg.sender, uint256(dna));
        _setTokenURI(newTokenIndex, tokenUri_);

        emit TokenMinted(price, dna);
    }

    function _burn(uint256 dna) internal virtual override {
        uint256 tokenIndex = byDna[dna];

        delete byDna[dna];
        delete tokens[tokenIndex];

        super._burn(dna);

        emit TokenBurned(dna);
    }

//    function _beforeTransferHook(address from, address to, uint256 amount)
//        internal virtual override
//    {
//        super._beforeTransferHook(from, to, amount);
//    }

    function getMintPrice() public view returns(uint256) {
        return _getMintPrice(tokens.length);
    }

    function _getMintPrice(uint256 tokenIndex_) private view returns(uint256) {
        return firstPrice + (priceIncrement * tokenIndex_);
    }

    function dnaExists(uint256 dna_) public view returns (bool) {
        return byDna[dna_] != 0;
    }

    function getTokenURI(uint256 tokenId_) public view returns (string memory) {
        return tokenURI(tokenId_);
    }

    function getTokenOverview(uint256 tokenId_) public view returns (uint256, string memory)
    {
        uint256 tokenIndex = byDna[tokenId_];
        return (
            tokens[tokenIndex].dna,
            tokenURI(tokenId_)
        );
    }
}