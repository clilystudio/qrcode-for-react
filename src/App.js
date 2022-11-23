import './App.css';
import { QRCodeCanvas, QRCodeSVG } from './lib';
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
        <QRCodeCanvas data={'QRCodeCanvas'} config={{}} />
        <QRCodeSVG data={'QRCodeSVG'} config={{}} />
      </header>
    </div>
  );
}

export default App;
