
import React, { Component } from 'react';
import './App.css';
import MineSweeper from './Components/MineSweeper';

class App extends Component {
    render() {
        return (
            <div id="App" className="App">
                <MineSweeper></MineSweeper>
            </div>
        );
    }
}
export default App;
