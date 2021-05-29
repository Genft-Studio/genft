// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Genft.sol";

contract GenftFactory is Ownable {
    Genft[] public instances;
    event InstanceCreated(address indexed _from, address indexed _instance);
    address walletAddress;

    function get(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _minimumDifficultyBits,
        uint8 _genomeBitLength,
        uint256 _firstPrice,
        uint256 _priceIncrement,
        string memory _baseTokenURI,
        string memory _uiConfigUri,
        uint256 _commissionPercentage
    ) external {
        // TODO make and pass a payment splitter (https://docs.openzeppelin.com/contracts/2.x/api/payment)

        Genft instance = new Genft(
            _tokenName,
            _tokenSymbol,
            _minimumDifficultyBits,
            _genomeBitLength,
            _firstPrice,
            _priceIncrement,
            _baseTokenURI,
            _uiConfigUri,
            walletAddress,
            _commissionPercentage
        );
        instances.push(instance);
        emit InstanceCreated(msg.sender, address(instance));
    }

    function setWalletAddress(address addr) public onlyOwner {
        walletAddress = addr;
    }

}