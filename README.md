# genft - An NFT Minter Factory
Genft is a factory that creates a minting contract for generative art NFTs

The NFT artist uploads component images that can be assembled into a unique NFT image. The components are selected based on random DNA and assembled to create unique NFTs. The system deploys a ERC721 contract and an IPFS file with the settings of for an image generator. It also creates a minting page.

When the user wants a token, they go to the minting page and 'mine' for a valid DNA and submits it to the ERC721 contract. DNA is generated through a proof of work mining process. The miner runs as a web worker. When a seed is found the hashes to a valid token id, it can be claimed with the mint() function.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
You
## Credits
Created by Ken Hodler (@bgok) and Morgan Sherwood (@morganstar) at [Web3Weekend](https://web3.ethglobal.co/).