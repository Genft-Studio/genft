import _ from "lodash"
import {useEffect, useState} from "react";
import {NFTStorage} from "nft.storage";
import TokenView from "./TokenView";
import {ethers} from "ethers";
import genftFactoryDetails from "./abis/GenftFactory.json";
import {Link} from "react-router-dom";

function FactoryFactory() {
    const nftStorageKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaXRodWJ8MTU5NzUxIiwiaXNzIjoibmZ0LXN0b3JhZ2UiLCJpYXQiOjE2MTYxODI3MTI2ODUsIm5hbWUiOiJTSVgtQklUIn0.zqSNtZNehlfluFHVtRipupGOnoq_09Lg2w6dIe9ec2Q"
    const genftFactoryAddress = "0x74AaF8415506AdefD3f267A570fd0dE7d4101eC4"  // TODO: LOCAL DEV SERVER ADDRESS - Replace this with deployed address
    const [nftStorageClient, setNftStorageClient] = useState(null)
    const [cidRoot, setCidRoot] = useState("")
    const [localFiles, setLocalFiles] = useState([[], [], []])
    const [ipfsResults, setIpfsResults] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [genftFactoryContract, setGenftFactoryContract] = useState(null)
    const [genftAddress, setGenftAddress] = useState(null)
    const [genftId, setGenftId] = useState(null)
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [initialPrice, setInitialPrice] = useState(".001")
    const [priceIncrement, setPriceIncrement] = useState(".00005")

    const filesToFileNames = (files) => {
        let fileNames = []
        for(let i=0; i<files.length; i++) {
            fileNames.push(files[i].name)
        }
        return fileNames
    }

    const ipfsGatewayUrl = (cid) => {
        return 'https://' + cid + '.ipfs.dweb.link/'
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const fetchFromIpfs = async cid => {
        // Fetch assets from IPFS gateway
        // TODO: Maybe use JS IPFS library to fetch data instead?
        let jsonData
        try {
            const assetUrl = ipfsGatewayUrl(cid)
            console.log("Fetching assets from IPFS with gateway url: ", assetUrl)
            let response = await fetch(assetUrl)
            if (response.ok) { // if HTTP-status is 200-299 get the response body
                jsonData = await response.json()
                // setAssetData(jsonData)
                console.log("assetData: ", jsonData)
            } else {
                console.log("HTTP-Error: " + response.status)
            }
            return jsonData
        } catch (e) {
            console.log("ERROR: Fetching data from IPFS gateway: ", e.toString())
            return
        }
    }

    const handleFileUpload = async (event, layer) => {
        const files = event.target.files;
        for(let i=0; i<files.length; i++) {
            // upload a file
            const file = files[i];
            console.log("file ", i, file);

            if (_.isNull(file)) {
                console.log("ALERT: file is null")
                return
            }
        }

        let tmpLocalFiles = localFiles
        tmpLocalFiles[layer] = files
        console.log("tmpLocalFiles", tmpLocalFiles)
        console.log("uploaded file names", filesToFileNames(files))

        setLocalFiles(tmpLocalFiles)
    }

    const handleConnectEthereum = async () => {
        console.log("Request to connect to Ethereum")
        let newProvider
        let newSigner
        try {
            await window.ethereum.enable()
            newProvider = new ethers.providers.Web3Provider(window.ethereum);
            console.log("provider:", newProvider)
            setProvider(newProvider)
            newSigner = newProvider.getSigner();
            console.log("signer:", newSigner)
            setSigner(newSigner)

            // Sanity check
            const blockNumber = await newProvider.getBlockNumber()
            console.log("blockNumber:", blockNumber)
            const myAddress = await newSigner.getAddress()
            console.log("myAddress:", myAddress)
        } catch (e) {
            console.log("ERROR: Connecting to Ethereum wallet: ", e.toString())
            return
        }

        console.log("abi", genftFactoryDetails.abi)
        try {
            // Setup Genft Factory contract model
            const contract = new ethers.Contract(genftFactoryAddress, genftFactoryDetails.abi, newProvider)
            const contractWithSigner = contract.connect(newSigner)
            setGenftFactoryContract(contractWithSigner)
        } catch (e) {
            console.log("ERROR: Using GenftFactory contract: ", e.toString())
            return
        }
    }

    const handleDeployMinter = async () => {
        console.log("Request to deploy minter contract")
        const signerAddress = await signer.getAddress();

        // Setup event listener for child contract creation
        genftFactoryContract.on("InstanceCreated", async (from, child, id, event) => {
            console.log("InstanceCreated event received", from, child, id, event)
            if(from === signerAddress) {
                console.log("Detected creation of new Genft child contract instance by current user: #", id, child)
                setGenftAddress(child)
                setGenftId(id.toString())
            }
        })

        // Initiate transaction to Genft Factory to create a new Genft contract
        // Include IPFS cid for asset data
        let minimumDifficulty = 20
        let dnaBitLength = 6 * 8
        let baseTokenURI = ""           // TODO: Set this to something appropriate
        let commissionPercentage = 5

        try {
            const result = await genftFactoryContract.get(
                tokenName,
                tokenSymbol,
                minimumDifficulty,
                dnaBitLength,
                ethers.utils.parseEther(initialPrice),
                ethers.utils.parseEther(priceIncrement),
                baseTokenURI,
                cidRoot,
                commissionPercentage,
            )
        } catch (e) {
            console.log("ERROR: Problem running get() on factory contract: ", e.toString())
        }

    }

    // Use nft.storage to push and pin data to IPFS
    const handleIPFSUpload = async () => {
        // TODO: Show in-progress indicator in case upload takes a noticeable amount of time

        // Upload files to IPFS in a single JSON blob, get CID for blob
        let cid
        let fileData = []
        for(let layerIndex=0; layerIndex<localFiles.length; layerIndex++) {
            fileData[layerIndex] = []
            for(let fileIndex=0; fileIndex<localFiles[layerIndex].length; fileIndex++) {
                fileData[layerIndex].push(await toBase64(localFiles[layerIndex][fileIndex]))
            }
        }

        // TODO: Include NFT collection configuration data - anything that doesn't need to be saved on-chain
        let data = {
            // filenames: [filesToFileNames(localFiles[0]), filesToFileNames(localFiles[1]), filesToFileNames(localFiles[2])],
            layers: fileData,
            difficulty: 20,
            genomeLength: 5 * 8,
            tokenName,
            tokenSymbol
        }

        console.log("data to push to IPFS: ", data)
        try {
            const content = new Blob([JSON.stringify(data)])
            cid = await nftStorageClient.storeBlob(content)
            setCidRoot(cid)
            console.log("cid: ", cid)
            console.log("Asset data stored at: " + ipfsGatewayUrl(cid))
        } catch (e) {
            console.log("ERROR: Problem uploading to nft.storage: ", e.toString())
            // setLaunchStatus("error")
            return
        }

        let fetchedData = await fetchFromIpfs(cid)
        console.log("fetchedData", fetchedData)
        setIpfsResults(fetchedData)
    }

    useEffect(() => {
        console.log("localFiles", localFiles)
    }, [localFiles])

    useEffect(() => {
        // Initialize nft.storage client
        const client = new NFTStorage({ token: nftStorageKey })
        setNftStorageClient(client)
    }, [])

    return (
        <div className="App">
            <header className="App-container">
                <h1>Factory Factory</h1>

                {_.isEmpty(cidRoot) && (
                    <>
                        <h2>Token Settings</h2>
                        <h3>Name</h3>
                        <label>
                            <input type="text" value={tokenName}
                                   onChange={e => setTokenName(e.target.value)} />
                        </label>
                        <h3>Symbol</h3>
                        <label>
                            <input type="text" value={tokenSymbol}
                                   onChange={e => setTokenSymbol(e.target.value)} />
                        </label>
                        <h3>Initial Price</h3>
                        <label>
                            <input type="text" value={initialPrice}
                                   onChange={e => setInitialPrice(e.target.value)} />
                        </label>
                        <h3>Price Increment</h3>
                        <label>
                            <input type="text" value={priceIncrement}
                                   onChange={e => setPriceIncrement(e.target.value)} />
                        </label>

                        <h2>Select Source Files</h2>
                        <h3>Layer 0</h3>
                        <label className="file-upload">
                            <input type="file" multiple onChange={e => handleFileUpload(e, 0)} />
                        </label>
                        <h3>Layer 1</h3>
                        <label className="file-upload">
                            <input type="file" multiple onChange={e => handleFileUpload(e, 1)} />
                        </label>
                        <h3>Layer 2</h3>
                        <label className="file-upload">
                            <input type="file" multiple onChange={e => handleFileUpload(e, 2)} />
                        </label>
                        <br />

                        <button onClick={handleIPFSUpload}>
                            <h2>Push Genome Data to IPFS</h2>
                        </button>
                    </>
                )}
                {!_.isEmpty(cidRoot) && (
                    <>
                        <h3>
                            Image layer data commited to IPFS<br />
                            <a href={ipfsGatewayUrl(cidRoot)} target="_blank">{cidRoot}</a>
                        </h3>

                        {!_.isNull(ipfsResults) && 'layers' in ipfsResults && !_.isEmpty(ipfsResults.layers) && (
                            <div className="factory-preview">
                                {ipfsResults.layers.map((layer, layerIndex) => {
                                    return (
                                        <div className="layers">
                                            <h3>Layer {layerIndex}</h3>
                                            {layer.map(imageData => {
                                                return (
                                                    <img src={imageData} />
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                                <h2>Random Sample</h2>
                                <TokenView genome={ipfsResults} showMeta={true} />
                            </div>
                        )}

                        <br />
                        {_.isNull(signer) && (
                            <button onClick={handleConnectEthereum}>
                                Connect Wallet
                            </button>
                        )}
                        {!_.isNull(signer) && _.isNull(genftAddress) && (
                            <button onClick={handleDeployMinter}>
                                <h2>Deploy NFT Minter</h2>
                            </button>
                        )}

                        {!_.isNull(genftId) && (
                            <h2>
                                Genft Minting Contract Deployed:<br />
                                <Link to={genftAddress}>#{genftId}: {genftAddress}</Link>
                            </h2>
                        )}
                        <br />
                        <br />
                    </>
                )}

            </header>
        </div>
    )
}

export default FactoryFactory
