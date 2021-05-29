import _ from "lodash"
import mergeImages from 'merge-images'
import {useState, useEffect} from "react"
import {genftParser} from "./genft-parser";
import body from './assets/body.png'
import eyes from './assets/eyes.png'
import mouth from './assets/mouth.png'
import body2 from './assets/body-02.png'
import body3 from './assets/body-03.png'
import eyes2 from './assets/eyes-02.png'
import mouth2 from './assets/mouth-02.png'

function TokenView(props) {
    const [dna, setDna] = useState("")
    const [imageData, setImageData] = useState(null)
    const [genome, setGenome] = useState(null)

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
                const genft = await genftParser(dna, genome)
                // const genft = await genftParser(dna)
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
        if(props.genome) {
            console.log("props.genome", props.genome)
            setGenome(props.genome)
        } else {
            setGenome({
                layers: [
                    [body, body2, body3],
                    [eyes, eyes2],
                    [mouth, mouth2]
                ]
            })
        }

        // mergeImages(['/assets/body.png', '/assets/eyes.png', '/assets/mouth.png'])
        //     .then(b64 => document.querySelector('.gen-img').src = b64)

        if(props.dna) {
            setDna(props.dna)
        } else {
            randomDna()
        }

    }, [])

    return (
        <div class="token-view">
            DNA:
            {props.dna && (
                <>
                    {props.dna}
                </>
            )}
            {!props.dna && (
                <>
                    <input value={dna} onChange={e => setDna(e.target.value)} />
                    <button onClick={handleRandomDna}>
                        Random
                    </button>
                </>
            )}
            <br />

            <img src="" className="gen-img" alt="logo" />

            {!_.isNull(imageData) && (
                <img src={imageData} alt="" style={{border: "4px solid #eeeeee"}} />
            )}
        </div>
    );

}

export default TokenView
