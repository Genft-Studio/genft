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

function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

function rotateImage(img, amount) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Point of transform origin
    // ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    // ctx.fillStyle = 'blue';
    // ctx.fill();

    // Non-rotated rectangle
    // ctx.fillStyle = 'gray';
    // ctx.fillRect(100, 0, 80, 20);

    // Rotated rectangle
    ctx.rotate(amount * Math.PI / 180);
    // ctx.fillStyle = 'red';
    // ctx.fillRect(100, 0, 80, 20);

    // Reset transformation matrix to the identity matrix
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    return ctx
}

export async function genftParser(dna, genome) {
    let genft = {
        dna: dna,
    }

    console.log("genftParser dna: ", dna)
    console.log("genftParser genome: ", genome)

    // TODO: Implement any genome parameters for DNA to be parsed against

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

    // Pseudo-rotate - generate X number between -64 and 64
    const rotateX = (genes[0] % 128) - 64
    // Pseudo-rotate - generate Y number between -32 and 32
    const rotateY = (genes[1] % 64) - 32
    genft.rotateX = rotateX
    genft.rotateY = rotateY

    // TODO: Implement Z rotation of image
    // const rotateZ = Math.floor(convertRange(genes[2], [0, 255], [0, 356]))
    // genft.rotateZ = rotateZ

    const layer0 = genes[2] % genome.layers[0].length
    const layer1 = genes[3] % genome.layers[1].length
    const layer2 = genes[4] % genome.layers[2].length

    // NOTE: Genes could be used more efficiently to allow extracting additional data without sacrificing resolution

    let imageSources = [
        { src: genome.layers[0][layer0], x: 0, y: 0 },
        { src: genome.layers[1][layer1], x: rotateX, y: rotateY },
        { src: genome.layers[2][layer2], x: (rotateX/2), y: (rotateY/1.5) }
    ]

    let b64 = await mergeImages(imageSources)

    genft.imageData = b64

    return genft
}

export function parseImage() {

}