/**
 * Floati
 * MIT Licensed
 *
 * @fatherbrennan
 */
import React from 'react';
import Home from './../Home/Home';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    setKeyBindings(...bindings) {
        this.keyBindings = {
            ...this.props.keyBindings,
            ...this.state.keyBindings,
            ...(bindings.length > 0
                ? bindings.reduce((a, b) => {
                      return { ...a, ...b };
                  })
                : bindings),
        };
    }

    useKeyBindings(e) {
        const combo = `${e.altKey ? 'altKey' : ''}${e.ctrlKey ? 'ctrlKey' : ''}${e.metaKey ? 'metaKey' : ''}${e.shiftKey ? 'shiftKey' : ''}${e.code.slice()}`;
        if (this.keyBindings[combo] !== undefined) this.keyBindings[combo]();
    }

    render() {
        return <Home setKeyBindings={this.setKeyBindings} useKeyBindings={this.useKeyBindings} />;
    }
}

export default App;
