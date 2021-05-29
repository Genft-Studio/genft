import React, {useEffect} from "react"
import {useParams} from "react-router-dom"
import GenftContract from "genft/Genft.json"
import {useWorker} from "react-hooks-worker";

const createMiner = () => new Worker('./miner.worker.js', {type: 'module'})
const testAddress = '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'

export default () => {
    const {collectionId} = useParams()
    const {result, error} = useWorker(createMiner, ['$OWL', 16, 32, testAddress])

    console.log('result:', JSON.stringify(result))

    // useMiner(navigator.hardwareConcurrency - 1)

    return (
        <div>
            {error && <>Mining accident occured: {error}</>}
            {!error && <>Result: {JSON.stringify(result)}</>}
        </div>
    )

}