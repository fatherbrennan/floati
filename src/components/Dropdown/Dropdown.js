/**
 * Floati
 * MIT Licensed
 *
 * @fatherbrennan
 */
import React from 'react';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        // Register methods
        this.getClassName = this.getClassName.bind(this);
    }

    getClassName(initialClassName, testProp) {
        return `${initialClassName}${testProp ? ' ' + testProp : ''}`;
    }

    render() {
        return (
            <div className={this.getClassName('dd', this.props.class)}>
                <button type="button" className={this.getClassName('dd-head', this.props.headClass)}>
                    {this.props.label || '⚙'}
                </button>
                <ul tabIndex="-1" className={this.getClassName('dd-body', this.props.bodyClass)}>
                    {this.props.firstItem ? (
                        <li className="dd-item-static">
                            <h4 className="dd-item-heading">{this.props.firstItem.heading || null}</h4>
                            <div className="dd-item-text">{this.props.firstItem.text || null}</div>
                        </li>
                    ) : null}
                    {this.props.firstItem ? <hr className="dd-item-separator" /> : null}
                    {this.props.items.map((item, index) => {
                        if (item) {
                            return (
                                <li key={item.id || index} className={`dd-item${item.active ? ' active' : ''}`}>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={this.props.clickEvent}
                                        data-index={this.props.dataIndex ? item[this.props.dataIndex] || item.index || index : null}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        );
    }
}

export default Dropdown;
