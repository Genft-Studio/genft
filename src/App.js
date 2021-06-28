import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import mergeImages from 'merge-images'
import TokenPage from "./TokenPage";
import FactoryFactory from "./FactoryFactory";
import MineToken from "./MineToken";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";

function App() {
    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">GenFT Studio</Navbar.Brand>
                <Navbar id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Studios">
                            <NavDropdown.Item href="/studio/pixel-editor">Pixel Editor</NavDropdown.Item>
                            <NavDropdown.Item href="/studio/layered-images">Image</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/collections">Collections</Nav.Link>
                        <Nav.Link href="/123/456">View Token</Nav.Link>
                    </Nav>
                </Navbar>
            </Navbar>
            <Switch>
                <Route path="/" exact>
                    <Home/>
                </Route>
                <Route path="/studio/layered-images" exact>
                    <FactoryFactory/>
                </Route>
                <Route path="/studio/pixel-editor" exact>
                    <h1>Pixel editor studio</h1>
                </Route>
                <Route path="/:collectionId" exact>
                    <h1>Collection Gallery</h1>
                </Route>
                <Route path="/:collectionId/mine" exact>
                    <MineToken/>
                </Route>
                <Route path="/:collectionId/:tokenId" exact>
                    <TokenPage/>
                </Route>
                <Route path="/collections">
                    <h1>List of collections</h1>
                </Route>
            </Switch>
        </Router>
    );
}

function Home() {
    mergeImages(['/assets/body.png', '/assets/eyes.png', '/assets/mouth.png'])
        .then(b64 => document.querySelector('.App-logo').src = b64)

    return (
        <div className="App">
            <header className="App-container">
                <h1>GENFT</h1>
                <img src="" className="App-logo" alt="logo"/>
            </header>
        </div>
    );
}

export default App;
