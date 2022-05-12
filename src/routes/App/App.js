/**
 * Floati
 * MIT Licensed
 *
 * @fatherbrennan
 */
import React from 'react';
import Home from './../Home/Home';
import KeyBinder from './../../common/KeyBinder';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.keyBindings = new KeyBinder();
    }

    render() {
        return <Home KeyBinder={this.keyBindings} />;
    }
}

export default App;
