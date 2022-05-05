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
    }

    render() {
        return (
            <div className="dd">
                <button type="button" className="dd-head">
                    {this.props.label || '⚙'}
                </button>
                <ul tabIndex="-1" className={`dd-body${this.props.right ? ' right' : ''}`}>
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
