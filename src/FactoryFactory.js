import _ from "lodash"
import {useEffect, useState} from "react";

function FactoryFactory() {
    const [localFiles, setLocalFiles] = useState([[], [], []])

    const handleFileUpload = async (event, layer) => {
        const files = event.target.files;
        for(let i=0; i<files.length; i++) {
            // upload a file
            const file = files[i];
            console.log("file ", i, file);

            if (_.isNull(file)) {
                console.log("ALERT: file is null")
                return
            }
            // TODO: Upload files to IPFS when user is ready to create factory, get CID for bucket
        }

        let tmpLocalFiles = localFiles
        tmpLocalFiles[layer] = files
        console.log("tmpLocalFiles", tmpLocalFiles)
        setLocalFiles(tmpLocalFiles)
    }

    useEffect(() => {
        console.log("localFiles", localFiles)
    }, [localFiles])

    return (
        <div className="App">
            <header className="App-container">
                <h1>Factory Factory</h1>

                <h2>Upload Source Files</h2>
                <h3>Layer 0</h3>
                <label className="file-upload">
                    <input type="file" multiple onChange={e => handleFileUpload(e, 0)} />
                    ^ Upload
                </label>
                <h3>Layer 1</h3>
                <label className="file-upload">
                    <input type="file" multiple onChange={e => handleFileUpload(e, 1)} />
                    ^ Upload
                </label>
                <h3>Layer 2</h3>
                <label className="file-upload">
                    <input type="file" multiple onChange={e => handleFileUpload(e, 2)} />
                    ^ Upload
                </label>
            </header>
        </div>
    )
}

export default FactoryFactory
