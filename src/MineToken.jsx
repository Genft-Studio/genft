import React, {useState} from "react"
import TokenMiner from "./TokenMiner";
import {Button} from "react-bootstrap";
import {genftParser} from "./genft-parser";
import {useParams} from "react-router-dom";

// import body from "./assets/body.png";
// import body2 from "./assets/body-02.png";
// import body3 from "./assets/body-03.png";
// import eyes from "./assets/eyes.png";
// import eyes2 from "./assets/eyes-02.png";
// import mouth from "./assets/mouth.png";
// import mouth2 from "./assets/mouth-02.png";

import Particles from "react-tsparticles";

import './MineToken.scss'
import {SAMPLE_GENOME} from "./sampleData";
import {ethers} from "ethers";
import genftFactoryDetails from "./abis/GenftFactory.json";
import genftDetails from "./abis/Genft.json";
import _ from "lodash";

const TEST_SETTINGS = SAMPLE_GENOME

const TEST_ADDRESS = '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'

const backgroundOptions = {
    background: {
        color: {
            value: "#333333",
        },
    },
    fpsLimit: 60,
    interactivity: {
        detectsOn: "canvas",
        events: {
            onClick: {
                enable: true,
                mode: "push",
            },
            onHover: {
                enable: true,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
            },
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
        },
    },
    particles: {
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
            enable: true,
        },
        move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 6,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                value_area: 800,
            },
            value: 80,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            random: true,
            value: 5,
        },
    },
    detectRetina: true,
};

const MineToken = () => {
    const {collectionId} = useParams()
    const genftFactoryAddress = "0x74AaF8415506AdefD3f267A570fd0dE7d4101eC4"  // TODO: LOCAL DEV SERVER ADDRESS - Replace this with deployed address
    const [isMining, setIsMining] = useState(false)
    const [foundTokens, setFoundTokens] = useState([])
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [myAddress, setMyAddress] = useState(null)
    const [genftFactoryContract, setGenftFactoryContract] = useState(null)
    const [genftContract, setGenftContract] = useState(null)
    const [genftAddress, setGenftAddress] = useState(null)

    const handleFoundToken = async token => {
        if (token && token.dna) {
            setFoundTokens([...foundTokens, {...token, img: await genftParser(token.dna, TEST_SETTINGS)}])
        }
    }

    const handleConnectEthereum = async () => {
        // TODO: Make Ethereum connection usable throughout React app, instead of re-implementing on specific pages
        console.log("Request to connect to Ethereum")
        let newProvider
        let newSigner
        let signerAddress
        try {
            await window.ethereum.enable()
            newProvider = new ethers.providers.Web3Provider(window.ethereum);
            console.log("provider:", newProvider)
            setProvider(newProvider)
            newSigner = newProvider.getSigner();
            console.log("signer:", newSigner)
            setSigner(newSigner)
            signerAddress = await newSigner.getAddress();
            setMyAddress(signerAddress)
        } catch (e) {
            console.log("ERROR: Connecting to Ethereum wallet: ", e.toString())
            return
        }

        // console.log("abi", genftDetails.abi)
        try {
            // Setup Genft Factory contract model
            const factoryContract = new ethers.Contract(genftFactoryAddress, genftFactoryDetails.abi, newProvider)
            const factoryContractWithSigner = factoryContract.connect(newSigner)
            setGenftFactoryContract(factoryContractWithSigner)

            let instanceAddress = await factoryContractWithSigner.instances(collectionId)
            console.log("instanceAddress", instanceAddress)
            setGenftAddress(instanceAddress)

            // Setup Genft contract model
            const contract = new ethers.Contract(instanceAddress, genftDetails.abi, newProvider)
            const contractWithSigner = contract.connect(newSigner)
            setGenftContract(contractWithSigner)

            contractWithSigner.on("TokenMinted", async (from, dna, event) => {
                console.log("TokenMinted event detected", from, dna, event)
                if(from === signerAddress) {
                    console.log("Detected mint of new Genft token by current user: ", dna)
                    // TODO: Redirect to token page for newly minted token
                }
            })
        } catch (e) {
            console.log("ERROR: Using GenftFactory or Genft contract: ", e.toString())
            return
        }
    }

    const handleMintToken = async (seed) => {
        seed = "0x" + seed
        console.log("Request to mint token with seed: ", seed)
        try {
            // TODO: Set tokenUri to something meaningful (or remove it from the spec if unnecessary)
            const tokenUri = ""
            const result = await genftContract.mint(seed, tokenUri)
            // TODO: Fix whatever is failing with a VM Exception when attempting to run genftContract.mint
        } catch (e) {
            console.log("ERROR: Minting token: ", e.toString())
        }
    }

    return (
        <div className='MineTokenPage'>
            {isMining &&
            <Particles
                id="miningInProgressBackground"
                options={backgroundOptions}
            />
            }
            <div className='inner'>

                {_.isNull(signer) && (
                    <button onClick={handleConnectEthereum}>
                        Connect Wallet
                    </button>
                )}
                {!_.isNull(signer) && (
                    <>
                        {!isMining && <Button onClick={() => setIsMining(true)}>Start mining</Button>}
                        {isMining &&
                        <>
                            <TokenMiner
                                tokenId={TEST_SETTINGS.tokenId}
                                difficulty={TEST_SETTINGS.difficulty}
                                genomeLength={TEST_SETTINGS.genomeLength}
                                // address={TEST_ADDRESS}
                                address={myAddress}
                                onSuccess={handleFoundToken}
                            />
                            <Button onClick={() => setIsMining(false)}>Stop mining</Button>
                        </>
                        }
                        <div className='availableTokens'>
                            {foundTokens.map(token =>
                                <div key={token.dna} id={`token-${token.dna}`} className='token' onClick={() => {handleMintToken(token.seed, "")}}>
                                    {token.img.imageData && <img src={token.img.imageData} title={`DNA: ${token.dna}`} />}
                                </div>
                            )}
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default MineToken