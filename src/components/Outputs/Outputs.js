/**
 * Floati
 * MIT Licensed
 *
 * @fatherbrennan
 */
import React from 'react';

class Outputs extends React.Component {
    constructor(props) {
        super(props);

        this.viewBoxX = 80;
        this.viewBoxY = 16;
        this.viewBoxHalfY = this.viewBoxY / 2;

        this.charX = 0.602051;
        this.charY = 1;
        this.charM = this.charY / this.charX;

        this.fontSizeDefault = 12;
        this.fontSizeMinWidth = this.viewBoxX / (this.charX * this.fontSizeDefault);

        this.calculateFontSize = this.calculateFontSize.bind(this);
    }

    calculateFontSize(l) {
        if (l < this.fontSizeMinWidth) return this.fontSizeDefault;
        return (this.viewBoxX / l) * this.charM;
    }

    render() {
        return (
            <section className="col-12">
                {this.props.outputs.map(output => {
                    if (output.active === true) {
                        return (
                            <div className="form-group" key={output.id}>
                                <label>{output.label}</label>
                                <div className="row form-group-container px-1">
                                    <div className="col-2 row center-y-row">
                                        <a
                                            className="icon icon-btn"
                                            title="Copy to Clipboard"
                                            onClick={e => {
                                                /**
                                                 * Momentarily add a class.
                                                 * @param {string} className Class name.
                                                 */
                                                const setNewClass = className => {
                                                    e.target.classList.add(className);
                                                    setTimeout(() => {
                                                        e.target.classList.remove(className);
                                                    }, 500);
                                                };

                                                // Copy text to clipboard
                                                navigator.clipboard
                                                    .writeText(output.value)
                                                    .then(() => setNewClass('success'))
                                                    .catch(() => setNewClass('error'));
                                            }}
                                        >
                                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.25 3.5h8.5v12h-8.5ZM5.25 0.5h8.5v12"></path>
                                            </svg>
                                        </a>
                                    </div>
                                    <div className="col-10">
                                        <svg
                                            viewBox={`0 0 ${this.viewBoxX} ${this.viewBoxY}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="100%"
                                            height="100%"
                                            className="fill-secondary"
                                        >
                                            <text
                                                x={this.viewBoxX}
                                                y={this.viewBoxHalfY}
                                                alignmentBaseline="central"
                                                dominantBaseline="central"
                                                textAnchor="end"
                                                fontSize={this.calculateFontSize(output.value.toString().length)}
                                            >
                                                {output.value}
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </section>
        );
    }
}

export default Outputs;
