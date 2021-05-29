import React, {useEffect} from "react"
import {useWorker} from "react-hooks-worker";

const createMiner = () => new Worker('./miner.worker.js', {type: 'module'})

export default ({tokenId, difficulty, genomeLength, address, onSuccess}) => {
    const {result, error} = useWorker(createMiner, [tokenId, difficulty, genomeLength, address])

    useEffect(() => onSuccess(result), [result])

    return (
        <>
            {error &&
            <div className='error'>
                Mining accident occured: {error}
            </div>
            }
        </>
    )

}