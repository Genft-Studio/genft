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
import {SAMPLE_GENOME} from "./sampleData";

function TokenView(props) {
    const [dna, setDna] = useState("")
    const [imageData, setImageData] = useState(null)
    const [genome, setGenome] = useState(null)
    const [genft, setGenft] = useState(null)
    const [showMeta, setShowMeta] = useState((props.showMeta === false) ? false : true)

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
                const genftResult = await genftParser(dna, genome)
                console.log("parsed genft data: ", genftResult)
                document.querySelector('.gen-img').src = genftResult.imageData
                setGenft(genftResult)
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
            setGenome(SAMPLE_GENOME)
        }

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
            {showMeta && !_.isNull(genft) && (
                <>
                <h3>Metadata</h3>
                    <ul class="metadata">
                        <li>Layer 0: {genft.layer0}</li>
                        <li>Layer 1: {genft.layer1}</li>
                        <li>Layer 2: {genft.layer2}</li>
                        <li>Look Side: {genft.lookSide}</li>
                        <li>Look Side Amount: {genft.lookSideAmount}</li>
                        <li>Look Vertical: {genft.lookVertical}</li>
                        <li>Look Vertical Amount: {genft.lookVerticalAmount}</li>
                    </ul>
                </>
            )}
        </div>
    );

}

export default TokenView
