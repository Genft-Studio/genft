// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Genft is ERC721URIStorage, ERC721Pausable, ERC721Burnable, AccessControlEnumerable {
    using Strings for string;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    event TokenMinted(uint256 amountPaid, uint256 dna);
    event TokenBurned(uint256 dna);

    uint256 public difficulty1Target;
    uint8 public genomeBitLength;
    uint256 public firstPrice;
    uint256 public priceIncrement;
    string public uiConfigUri;
    uint8 public commissionPercentage;
    string public baseTokenURI;
    address public factoryWalletAddress;
    address public artistAddress;

    mapping(uint256 => uint256) byDna; // dna must be unique

    uint256[] public tokens;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _genomeBitLength,
        uint256 _firstPrice,
        uint256 _priceIncrement,
        string memory _baseTokenURI,
        string memory _uiConfigUri,
        address _factoryWalletAddress,
        uint8 _commissionPercentage,
        address _artistAddress
    ) ERC721(_tokenName, _tokenSymbol) ERC721Pausable() ERC721Burnable() AccessControlEnumerable()
    {
        require(commissionPercentage < 100, "commission percentage too high");

        difficulty1Target = 2 ** (256 - uint256(_minimumDifficultyBits)) - 1;
        genomeBitLength = _genomeBitLength;
        firstPrice = _firstPrice;
        priceIncrement = _priceIncrement;
        uiConfigUri = _uiConfigUri;
        commissionPercentage = _commissionPercentage;
        baseTokenURI = _baseTokenURI;

        //set up roles
        _setupRole(PAUSER_ROLE, _artistAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, _factoryWalletAddress);
        _setupRole(PAUSER_ROLE, _factoryWalletAddress);

        // setup payees
        factoryWalletAddress = _factoryWalletAddress;
        artistAddress = _artistAddress;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function mint(
        uint256 seed_,
        string memory tokenUri_
    ) payable public {
        uint256 newTokenIndex = tokens.length;

        uint price = _getMintPrice();
        require(msg.value >= price, 'not enough paid');

        // Hash(sender + symbol + seed) yields the proof of work + DNA
        // PoW is used to introduce randomness, so that the minter can see it before they mint
        bytes32 work = keccak256(abi.encodePacked(msg.sender, symbol(), seed_));
        require(uint256(work) <= difficulty1Target, 'not enough work');

        // TODO distribute the funds via a payment splitter
        // pay the factory
        uint256 commission = price * uint256(commissionPercentage) / 100;
        if (commission > 0) {
            payable(factoryWalletAddress).transfer(commission);
        }

        // pay the artist
        uint256 artistPayment = 0;
        if (price > commission) {
            artistPayment = price - commission;
            payable(artistAddress).transfer(artistPayment);
        }

        // return change
        uint256 change = 0;
        if (msg.value > price) {
            change = msg.value - price;
            payable(msg.sender).transfer(change);
        }

        uint256 dna = uint256(work) % 2 ** uint256(genomeBitLength);

        tokens.push(dna);
        byDna[dna] = newTokenIndex;

        _safeMint(msg.sender, uint256(dna));
        _setTokenURI(dna, tokenUri_);

        emit TokenMinted(price, uint256(dna));
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        delete byDna[tokenId];
        delete tokens[byDna[tokenId]];

        super._burn(tokenId);

        emit TokenBurned(tokenId);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC721Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC721Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _getMintPrice() public view returns(uint256) {
        return firstPrice + (priceIncrement * tokens.length);
    }

    function dnaExists(uint256 dna_) public view returns (bool) {
        return byDna[dna_] != 0;
    }

    function getTokenURI(uint256 tokenId_) public view returns (string memory) {
        return tokenURI(tokenId_);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}