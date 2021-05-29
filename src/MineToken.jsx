import React, {useState} from "react"
import TokenMiner from "./TokenMiner";
import {Button} from "react-bootstrap";
import {genftParser} from "./genft-parser";
import {useParams} from "react-router-dom";

import body from "./assets/body.png";
import body2 from "./assets/body-02.png";
import body3 from "./assets/body-03.png";
import eyes from "./assets/eyes.png";
import eyes2 from "./assets/eyes-02.png";
import mouth from "./assets/mouth.png";
import mouth2 from "./assets/mouth-02.png";

import Particles from "react-tsparticles";

import './MineToken.scss'

const TEST_SETTINGS = {
    layers: [
        [body, body2, body3],
        [eyes, eyes2],
        [mouth, mouth2]
    ],
    tokenId: '$OWL',
    difficulty: 20,
    genomeLength: 6 * 8
}

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
    const [isMining, setIsMining] = useState(false)
    const [foundTokens, setFoundTokens] = useState([])
    const handleFoundToken = async token => {
        if (token && token.dna) {
            setFoundTokens([...foundTokens, {...token, img: await genftParser(token.dna, TEST_SETTINGS)}])
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
                {!isMining && <Button onClick={() => setIsMining(true)}>Start mining</Button>}
                {isMining &&
                <>
                    <TokenMiner
                        tokenId={TEST_SETTINGS.tokenId}
                        difficulty={TEST_SETTINGS.difficulty}
                        genomeLength={TEST_SETTINGS.genomeLength}
                        address={TEST_ADDRESS}
                        onSuccess={handleFoundToken}
                    />
                    <Button onClick={() => setIsMining(false)}>Stop mining</Button>
                </>
                }
                <div className='availableTokens'>
                    {foundTokens.map(token =>
                        <div key={token.dna} id={`token-${token.dna}`} className='token'>
                            {token.img.imageData && <img src={token.img.imageData}/>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MineToken