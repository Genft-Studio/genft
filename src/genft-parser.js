import mergeImages from 'merge-images'

function hexToBytes(hex){
    var result = []
    for(var i = 0; i < hex.length; i+=2){
        result.push(parseInt(hex.slice(i, i+2),16));
    }
    return result;
}

export async function genftParser(dna) {
    let genft = {
        dna: dna,
    }

    // TODO: Implement genome data for DNA to be parsed against

    if (!(typeof dna === 'string' || dna instanceof String))
    {
        throw new Error("dna must be of type string")
    }
    if(dna.slice(0,2) === "0x"){
        dna = dna.slice(2);
    }
    if(dna === "") {
        throw new Error("dna cannot be empty")
    }
    console.log("dna: ", dna)

    let genes
    try {
        genes = hexToBytes(dna)
    } catch (e) {
        throw new Error("Error converting dna to bytes: ", e.toString())
    }
    console.log("genes: ", genes)

    // TODO: use genes data to determine image src selection and position

    const rotate = (genes[0] % 64) - 32

    const b64 = await mergeImages([
        { src: '/assets/body.png', x: 0, y: 0 },
        // { src: '/assets/eyes.png', x: 32, y: 0 },
        { src: '/assets/eyes.png', x: rotate, y: 0 },
        // { src: '/assets/mouth.png', x: 16, y: 0 }
        { src: '/assets/mouth.png', x: (rotate/2), y: 0 }
    ])
    // ]).then(b64 => document.querySelector('.gen-img').src = b64)

    genft.imageData = b64

    return genft
}

export function parseImage() {

}