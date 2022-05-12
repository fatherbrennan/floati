export default class KeyBinder {
    constructor() {
        this.keyBindings = {};
        this._mergeBindings = this._mergeBindings.bind(this);
        this.getBindings = this.getBindings.bind(this);
        this.setBindings = this.setBindings.bind(this);
        this.addBindings = this.addBindings.bind(this);
        this.useBindings = this.useBindings.bind(this);
        this.removeBindings = this.removeBindings.bind(this);
    }

    _mergeBindings(bindings) {
        return bindings.length > 0
            ? bindings.reduce((a, b) => {
                  return { ...a, ...b };
              })
            : bindings;
    }

    getBindings() {
        return this.keyBindings;
    }

    setBindings(...bindings) {
        this.keyBindings = { ...this._mergeBindings(bindings) };
    }

    addBindings(...bindings) {
        this.keyBindings = {
            ...this.getBindings(),
            ...this._mergeBindings(bindings),
        };
    }

    useBindings(e) {
        const a = `${e.altKey ? 'altKey' : ''}${e.ctrlKey ? 'ctrlKey' : ''}${e.metaKey ? 'metaKey' : ''}${e.shiftKey ? 'shiftKey' : ''}${e.code.slice()}`;
        if (this.keyBindings[a] !== undefined) this.keyBindings[a]();
    }

    removeBindings(...bindings) {
        if (typeof bindings === 'string') delete this.keyBindings[bindings];
        else {
            const a = bindings[0] instanceof Array ? bindings[0] : bindings;
            for (let i = 0, l = a.length; i < l; i++) delete this.keyBindings[a[i]];
        }
    }
}
