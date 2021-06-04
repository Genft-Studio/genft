## Instructions
When the [project submission pull request](https://github.com/ipfs/community/pull/570) is accepted, [submit this application form](https://github.com/ipfs/devgrants/issues/new?assignees=mishmosh&labels=microgrant&template=microgrant.md&title=%5BMICROGRANT%5D+%3CYour+Title+Here%3E) 

## Title
[MICROGRANT] GenFT Studio

## Body

### 1. What is your project? (max 100 words)
GenFT Studio provides a set of simple tools for artists to create collections of generative art NFTs. The artist defines the parameters of the collection in a collection studio. We currently have two collection studios built and intend to add more in the future. Once the parameters of the collection are set up, the artist's patrons can mine/mint unique NFTs.

We are experimenting with multiple token economics strategies. The artist will be able to choose the economics they want to use when they create their NFT collection.

### 2. How are you planning to improve this project? (max 200 words)
1. Improve testing coverage.
2. Combine the two existing collection studios (pixel editor, image layer combiner) into a single project. As part of this effort, a *collection studio SDK* achitecture will be developed to simplify the creation of new collection studios.
3. Optimize gas consumption. In particular, the cost of launching a collection needs to be optimized. We will probably refactor the smart contract so that launching a collection doesn't require the deployment of a new contract instance.
4. Refactor the smart contracts to support upgradability.
5. Add support for generating instance of a collection on a private server so that the genome for the collection can be kept private.
6. Deploy the system to mainnet and set up the domain name.
7. Refine the handling of funds submitted with a minting request.
8. Implement acceptance of alternative assets (i.e. NFTs from the collection) in lieu of commission.

### 3. Will the work be Open Source?
<!-- MIT license for code or [CC-BY-SA 3.0](https://ipfs.io/ipfs/QmVreNvKsQmQZ83T86cWSjPu2vR3yZHGPm5jnxFuunEB9u) license for content. -->
***Yes***

### 4. If selected, do you agree to complete weekly updates and a grant report upon conclusion?
<!-- Include progress or results of your microgrant-funded work, any IPFS technical or usage guidance requests, and a description of your experience building on IPFS, including any challenges or shortcomings encountered. -->
***Yes***

### 5. Does your proposal comply with our Community Standards?
<!-- Please read the [Community Standards](https://github.com/protocol/ipfs-grants/blob/master/STANDARDS.md) and make sure your project is in compliance -->
***Yes***

### 6. Links and submissions
<!-- Complete each step, and include the link of the published submission (or "Yes" if there is no URL) -->

* Have you submitted to the IPFS Community Showcase ([instructions](https://github.com/ipfs/community/blob/master/README.md#showcase-your-project))?
***https://github.com/ipfs/community/pull/570***


* Have you added your project to the [IPFS Ecosystem Directory](https://airtable.com/shrjwvk9pAeAk0Ci7)? ***Yes***

* If your project began at a hackathon, have you submitted it for the relevant Protocol Labs prizes? Include links here if available:
  - [***Web3Weekend Submission***](https://showcase.ethglobal.co/web3weekend/nft-factory-factory)
  - [***HackNFT Submission***](https://showcase.ethglobal.co/nfthack/generative-art-nfts-with-gashapon)

  
* Have you filled out the [Interplanetary Builder Feedback Survey](https://airtable.com/shrDZMizx03jOa4mQ)? ***Yes***

### Additional questions:
* For each team member(s), please list name, email, Github account, and role in the project.
  
#### Morgan Sherwood
- email: morgan@endowl.com
- github: @morganstar
- position: Developer && Presenter

#### Ken Hodler
- email: ken@endowl.com
- github: @bgok
- position: BizOps && Developer

* If your project was created as part of an event or hackathon:
    * What was the name of the event? 
      - ***ETHGlobal NFTHack***
      - ***ETHGlobal Web3Weekend***
    * Please link to your hackathon submission, proving you're a team that submitted for a Protocol Labs prize.
      - [***Web3Weekend Submission***](https://showcase.ethglobal.co/web3weekend/nft-factory-factory)
      - [***HackNFT Submission***](https://showcase.ethglobal.co/nfthack/generative-art-nfts-with-gashapon)

