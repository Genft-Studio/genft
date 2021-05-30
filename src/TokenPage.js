import TokenView from "./TokenView";

function TokenPage(props) {
    return (
        <div className="App">
            <header className="App-container">
                <h1>Token Viewer</h1>
                <TokenView showMeta={true} />
            </header>
        </div>
    )
}

export default TokenPage
