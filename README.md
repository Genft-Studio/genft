# genft - An NFT Minter Factory
Genft is a factory that creates a minting contract for generative art NFTs

The NFT artist uploads component images that can be assembled into a unique NFT image. The components are selected based on random DNA and assembled to create unique NFTs. The system deploys a ERC721 contract and an IPFS file with the settings of for an image generator. It also creates a minting page.

When the user wants a token, they go to the minting page and 'mine' for a valid DNA and submits it to the ERC721 contract. DNA is generated through a proof of work mining process. The miner runs as a web worker. When a seed is found the hashes to a valid token id, it can be claimed with the mint() function.

## Dev instructions
1. Deploy factory contract and generate ABIs
```bash
% yarn build:contract
% yarn deploy
```
2. Make a copy of config file
```bash
% cp config.sample.json config.json 
```
3. Edit it with the addresses from your environment
4. `yarn start`

