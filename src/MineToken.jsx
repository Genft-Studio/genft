import React, {useState} from "react"
import TokenMiner from "./TokenMiner";
import {Button} from "react-bootstrap";

const MineToken = () => {
    const [isMining, setIsMining] = useState(false)
    const [foundTokens, setFoundTokens] = useState([])
    const handleFoundToken = token => {
        if (token) {
            setFoundTokens([...foundTokens, token])
        }
    }

    return (
        <>
            {!isMining && <Button onClick={()=>setIsMining(true)}>Start mining</Button>}
            {isMining && <>
                <TokenMiner tokenId={'$OWL'} difficulty={16} genomeLength={32} onSuccess={handleFoundToken}/>
                <Button onClick={() => setIsMining(false)}>Stop mining</Button>
            </>}
            {foundTokens.map(token => <div>{token.dna.toString('hex')}</div>)}
        </>
    )
}

export default MineToken