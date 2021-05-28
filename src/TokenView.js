import _ from "lodash"
import mergeImages from 'merge-images'
import {useState, useEffect} from "react"
import {genftParser} from "./genft-parser";

function TokenView() {
    const [dna, setDna] = useState("")
    const [imageData, setImageData] = useState(null)

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // For testing purposes
    const randomDna = () => {
        // 5 Byte DNA
        const bytes = 5
        const max = 256 ** bytes
        const randomInt = getRandomInt(max)
        const hexString = _.padStart(randomInt.toString(16), bytes * 2, 0)
        setDna("0x" + hexString)
    }

    const handleRandomDna = () => {
        randomDna()
    }

    useEffect(() => {
        const asyncDnaChanged = async (dna) => {
            try {
                // const genft = genftParser(dna, genome)
                const genft = await genftParser(dna)
                console.log("parsed genft data: ", genft)

                document.querySelector('.gen-img').src = genft.imageData
            } catch (e) {
                console.log("genftParser Error: ", e.toString())
                // setImageData(null)
            }
        }

        asyncDnaChanged(dna)

    }, [dna])

    useEffect(() => {
        mergeImages(['/assets/body.png', '/assets/eyes.png', '/assets/mouth.png'])
            .then(b64 => document.querySelector('.gen-img').src = b64)

        randomDna()
    }, [])

    return (
        <div className="App">
            <header className="App-container">
                <h1>Token Viewer</h1>
                DNA:
                <input value={dna} onChange={e => setDna(e.target.value)} />
                <button onClick={handleRandomDna}>
                    Random
                </button>
                <br />

                <img src="" className="gen-img" alt="logo" />

                {!_.isNull(imageData) && (
                    <img src={imageData} alt="" style={{border: "4px solid #eeeeee"}} />
                )}

            </header>
        </div>
    );

}

export default TokenView
