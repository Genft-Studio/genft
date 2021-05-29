import React, {useEffect} from "react"
import {useParams} from "react-router-dom"
import GenftContract from "genft/Genft.json"

export default () => {
    const {collectionId} = useParams()



    useEffect(() => {

    })

    return <div>Mining<br/>{JSON.stringify(GenftContract)}</div>
}