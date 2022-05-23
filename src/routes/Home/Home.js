/**
 * Floati
 * MIT Licensed
 *
 * @fatherbrennan
 */
import React from 'react';
import Dropdown from './../../components/Dropdown/Dropdown';
import Outputs from './../../components/Outputs/Outputs';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // Reference instance
        this.keyBindings = this.props.KeyBinder;

        // Set bindings
        this.keyBindings.setBindings({
            Slash: () => {
                this.inputElement.current.focus();
            },
        });

        this.state = {
            activeInvestment: '',
            // Default index
            activeFeeRate: 0,
            activeTaxRate: 0,
            activeMarginMultiplier: 0,
            outputs: [
                { id: 'profitMargin', label: 'Profit Margin', value: '0', active: true },
                { id: 'actualBuyValue', label: 'Actual Buy Value', value: '0', active: true },
                { id: 'buyFee', label: 'Buy Fee', value: '0', active: true },
                { id: 'actualSellValue', label: 'Actual Sell Value', value: '0', active: true },
                { id: 'sellAbove', label: 'Sell Above', value: '0', active: true },
                { id: 'sellFee', label: 'Sell Fee', value: '0', active: true },
                { id: 'profitBeforeTax', label: 'Profit Before Tax', value: '0', active: true },
                { id: 'profitAfterTax', label: 'Profit After Tax', value: '0', active: true },
                { id: 'taxPaid', label: 'Tax Paid', value: '0', active: true },
                { id: 'capital', label: 'Capital', value: '0', active: true },
            ],
            feeRates: [
                { label: 'none', value: 1 },
                { label: '0.1', value: 0.999 },
                { label: '1', value: 0.99 },
            ],
            taxRates: [
                { label: 'none', value: 1 },
                { label: '45', value: 0.55 },
            ],
            marginMultipliers: [
                { label: 'none', value: 1 },
                { label: '5', value: 1.05 },
            ],
            useOptionsLabels: false,
        };

        // Register refs
        this.inputElement = React.createRef();

        // Register methods
        this.inputFilter = this.inputFilter.bind(this);
        this.updateCalculations = this.updateCalculations.bind(this);
        this.updateActiveInvestment = this.updateActiveInvestment.bind(this);
        this.updateActiveFeeRate = this.updateActiveFeeRate.bind(this);
        this.updateActiveTaxRate = this.updateActiveTaxRate.bind(this);
        this.updateActiveMarginMultiplier = this.updateActiveMarginMultiplier.bind(this);
        this.toggleOutputVisibility = this.toggleOutputVisibility.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyBindings.useBindings);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyBindings.useBindings);
    }

    updateCalculations() {
        class Calculator {
            constructor(investment, feeRate, marginMultiplier, taxRate) {
                const useDefault = investment === 0 || isNaN(investment) ? '0' : false;
                this.investment = useDefault || investment;
                // Asked profit margin on investment (based on margin multiplier)
                this.profitMargin = useDefault || investment * marginMultiplier - investment;
                // Investment value excluding buy fee
                this.actualBuyValue = useDefault || investment * feeRate;
                // Amount paid in buying fees (transaction)
                this.buyFee = useDefault || investment - this.actualBuyValue;
                // Sell value excluding sell fees
                this.actualSellValue = useDefault || (this.profitMargin + this.buyFee) / taxRate + investment;
                // Sell value (value to sell at - calculation result)
                this.sellAbove = useDefault || this.actualSellValue / feeRate;
                // Amount paid in selling fees (transaction)
                this.sellFee = useDefault || this.sellAbove - this.actualSellValue;
                this.profitBeforeTax = useDefault || this.actualSellValue - investment;
                this.profitAfterTax = useDefault || this.profitBeforeTax * taxRate;
                this.taxPaid = useDefault || this.profitBeforeTax - this.profitAfterTax;
                this.capital = useDefault || this.actualBuyValue + this.profitAfterTax;
            }
        }

        const calculations = new Calculator(
            parseFloat(this.state.activeInvestment),
            this.state.feeRates[this.state.activeFeeRate].value,
            this.state.marginMultipliers[this.state.activeMarginMultiplier].value,
            this.state.taxRates[this.state.activeTaxRate].value
        );

        const newOutputs = this.state.outputs.map(o => {
            o.value = calculations[o.id];
            return o;
        });

        this.setState({ outputs: [...newOutputs] });
    }

    inputFilter(e) {
        const a = e.target.value.slice();
        const re = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
        let b = '';
        switch (true) {
            case /^0$/m.test(a):
                b = a;
                break;
            case /^[0\.|\.]$/m.test(a):
                b = '0.';
                break;
            case /\.$/m.test(a):
                const c = `${a.replace(/\.*$/, '.')}0`.match(re);
                b = c === null ? b : c[0].replace(/\.0$/, '.');
                break;
            default:
                const d = a.match(re);
                b = d === null ? b : d[0];
        }
        this.setState({ activeInvestment: b }, this.updateCalculations);
    }

    updateActiveInvestment() {
        this.setState({ activeInvestment: '' }, this.updateCalculations);
    }

    updateActiveFeeRate(e) {
        this.setState({ activeFeeRate: +e.target.dataset.index }, this.updateCalculations);
    }

    updateActiveTaxRate(e) {
        this.setState({ activeTaxRate: +e.target.dataset.index }, this.updateCalculations);
    }

    updateActiveMarginMultiplier(e) {
        this.setState({ activeMarginMultiplier: +e.target.dataset.index }, this.updateCalculations);
    }

    toggleOutputVisibility(e) {
        const newOutputs = [...this.state.outputs];
        const index = +e.target.dataset.index;
        newOutputs[index].active = !newOutputs[index].active;
        this.setState({ outputs: [...newOutputs] });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4 row p-1 center">
                        <div className="row options-container">
                            <Dropdown
                                headClass="icon icon-btn"
                                label={this.state.useOptionsLabels ? this.state.feeRates[this.state.activeFeeRate].label : null}
                                firstItem={{
                                    heading: 'Fee Rate',
                                    text: 'Percentage value between 0 and 100 representing the buy and sell fees.',
                                }}
                                items={this.state.feeRates}
                                clickEvent={this.updateActiveFeeRate}
                                dataIndex={true}
                            />
                            <Dropdown
                                headClass="icon icon-btn"
                                label={this.state.useOptionsLabels ? this.state.taxRates[this.state.activeTaxRate].label : null}
                                firstItem={{
                                    heading: 'Tax Rate',
                                    text: 'Percentage value between 0 and 100 representing the additional tax rate (e.g. Income Tax Rate).',
                                }}
                                items={this.state.taxRates}
                                clickEvent={this.updateActiveTaxRate}
                                dataIndex={true}
                            />
                            <Dropdown
                                headClass="icon icon-btn"
                                label={this.state.useOptionsLabels ? this.state.marginMultipliers[this.state.activeMarginMultiplier].label : null}
                                firstItem={{
                                    heading: 'Margin Multiplier',
                                    text: 'Percentage value greater than 0, representing the desired return on investment.',
                                }}
                                items={this.state.marginMultipliers}
                                clickEvent={this.updateActiveMarginMultiplier}
                                dataIndex={true}
                            />
                        </div>
                    </div>
                    <div className="col-8 p-1">
                        <div className="row">
                            <div className="col-12 form-group">
                                <label>Investment</label>
                                <div className="row form-group-container">
                                    <div className="col-10">
                                        <input
                                            ref={this.inputElement}
                                            autoFocus={true}
                                            type="text"
                                            tabIndex="1"
                                            className="text-primary"
                                            placeholder="0"
                                            value={this.state.activeInvestment}
                                            onFocus={() => {
                                                this.keyBindings.addBindings({
                                                    Delete: this.updateActiveInvestment,
                                                    Escape: this.updateActiveInvestment,
                                                });
                                            }}
                                            onBlur={() => {
                                                this.keyBindings.removeBindings('Delete', 'Escape');
                                            }}
                                            onKeyDown={this.keyBindings.useBindings}
                                            onInput={this.inputFilter}
                                        />
                                    </div>
                                    <div className="col-2 center-y-row end p-1 row">
                                        <div className="wrapper">
                                            <Dropdown
                                                bodyClass="right"
                                                firstItem={{
                                                    heading: 'Calculations',
                                                    text: 'Toggle the results visibility.',
                                                }}
                                                items={this.state.outputs}
                                                clickEvent={this.toggleOutputVisibility}
                                                dataIndex={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <Outputs outputs={this.state.outputs} />
                </div>
            </div>
        );
    }
}

export default Home;
