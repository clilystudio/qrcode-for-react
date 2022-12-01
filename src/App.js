import './App.css';
import { QRCodeSVG } from './lib';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <QRCodeSVG data={'01234567'} config={{version: 7, errorCorrectionLevel: 0, mask: 2}} />
      </header>
    </div>
  );
}

export default App;
