import logo from './logo.svg';
import './App.css';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import mergeImages from 'merge-images'

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>

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
                <img src="" className="App-logo" alt="logo" />
            </header>
        </div>
    );
}

export default App;
