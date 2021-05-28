import mergeImages from 'merge-images'

function hexToBytes(hex, bytesPerSlice = 2){
    // bytesPerSlice of 1 means each Hex character will become a number 0-15
    // bytesPerSlice of 2 means each pair of Hex character will become a number 0-255
    var result = []
    for(var i = 0; i < hex.length; i+=bytesPerSlice){
        result.push(parseInt(hex.slice(i, i+bytesPerSlice),16));
    }
    return result;
}

export async function genftParser(dna, genome) {
    let genft = {
        dna: dna,
    }

    console.log("genftParser dna: ", dna)
    console.log("genftParser genome: ", genome)

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

    // Pseudo-rotate - generate X number between -64 and 64
    const rotateX = (genes[0] % 128) - 64
    // Pseudo-rotate - generate Y number between -32 and 32
    const rotateY = (genes[1] % 64) - 32

    const b64 = await mergeImages([
        // { src: '/assets/body.png', x: 0, y: 0 },
        // { src: '/assets/eyes.png', x: rotate, y: 0 },
        // { src: '/assets/mouth.png', x: (rotate/2), y: 0 }
        { src: genome.layers[0][0], x: 0, y: 0 },
        { src: genome.layers[1][0], x: rotateX, y: rotateY },
        { src: genome.layers[2][0], x: (rotateX/2), y: (rotateY/1.5) }
    ])
    genft.imageData = b64

    return genft
}

export function parseImage() {

}