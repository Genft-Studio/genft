const Genft = artifacts.require("Genft");
const GenftFactory = artifacts.require("GenftFactory")

module.exports = async function (deployer) {
    await deployer.deploy(GenftFactory);

    let factory = await GenftFactory.deployed()
    await factory.setWalletAddress('0x534Eb19E729E955308e5A9c37c90d4128e0F450F')

    let tx = await factory.get(
        /*_tokenName*/"Wowlsa",
        /*_tokenSymbol*/ "$OWL",
        /*_minimumDifficultyBits*/ 16,
        /*_genomeBitLength*/ 32,
        /*_firstPrice*/ .001 * 10 ** 18,
        /*_priceIncrement*/ .00001 * 10 ** 18,
        /*_baseTokenURI*/ 'https://bafybeiawde3rbrxyhv2yelitx2awslwbjmfkxsqmjfx44hcv56dwf77f2m.ipfs.dweb.link/',
        /*_uiConfigUri*/ 'fooo',
        /*_commissionPercentage*/ 5,
    )


    let contractAddress = tx.logs[0].args["1"]

    let contract = await  Genft.at(contractAddress)

    // console.log(await contract.mint('foo', 'bar'))
}
