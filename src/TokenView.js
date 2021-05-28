import _ from "lodash"
import mergeImages from 'merge-images'
import {useState, useEffect} from "react"

function TokenView() {
    const [dna, setDna] = useState("")

    mergeImages(['/assets/body.png', '/assets/eyes.png', '/assets/mouth.png'])
        .then(b64 => document.querySelector('.gen-img').src = b64)

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
            </header>
        </div>
    );

}

export default TokenView
