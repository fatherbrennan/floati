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

        this.state = {
            activeInvestment: '',
            // Default index
            activeFeeRate: 0,
            activeIncomeTaxRate: 0,
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
            /**
             * Investment
             * -> >0
             *
             * Income Tax Rate
             * -> 1 - x / 100 is x% income tax rate
             * -> >0
             * -> <100
             *
             * Fee Rate
             * -> 1 - x / 100 is x% buy/sell fee
             * -> >0
             * -> <100
             *
             * Margin Multiplier
             * -> 1 + x / 100 is x% return on investment
             * -> >0
             */
            feeRates: [
                { label: 'none', value: 1 },
                { label: '0.1', value: 0.999 },
                { label: '1', value: 0.99 },
            ],
            incomeTaxRates: [
                { label: 'none', value: 1 },
                { label: '45', value: 0.55 },
            ],
            marginMultipliers: [
                { label: 'none', value: 1 },
                { label: '5', value: 1.05 },
            ],
            useOptionsLabels: false,
        };

        this.inputFilter = this.inputFilter.bind(this);
        this.inputKeyboardShortcuts = this.inputKeyboardShortcuts.bind(this);
        this.updateCalculations = this.updateCalculations.bind(this);
        this.updateActiveFeeRate = this.updateActiveFeeRate.bind(this);
        this.updateActiveIncomeTaxRate = this.updateActiveIncomeTaxRate.bind(this);
        this.updateActiveMarginMultiplier = this.updateActiveMarginMultiplier.bind(this);
        this.toggleOutputVisibility = this.toggleOutputVisibility.bind(this);
    }

    updateCalculations() {
        class Calculator {
            constructor(investment, feeRate, marginMultiplier, incomeTaxRate) {
                const useDefault = investment === 0 || isNaN(investment) ? '0' : false;
                this.investment = useDefault || investment;
                // Asked profit margin on investment (based on margin multiplier)
                this.profitMargin = useDefault || investment * marginMultiplier - investment;
                // Investment value excluding buy fee
                this.actualBuyValue = useDefault || investment * feeRate;
                // Amount paid in buying fees (transaction)
                this.buyFee = useDefault || investment - this.actualBuyValue;
                // Sell value excluding sell fees
                this.actualSellValue = useDefault || (this.profitMargin + this.buyFee) / incomeTaxRate + investment;
                // Sell value (value to sell at - calculation result)
                this.sellAbove = useDefault || this.actualSellValue / feeRate;
                // Amount paid in selling fees (transaction)
                this.sellFee = useDefault || this.sellAbove - this.actualSellValue;
                this.profitBeforeTax = useDefault || this.actualSellValue - investment;
                this.profitAfterTax = useDefault || this.profitBeforeTax * incomeTaxRate;
                this.taxPaid = useDefault || this.profitBeforeTax - this.profitAfterTax;
                this.capital = useDefault || this.actualBuyValue + this.profitAfterTax;
            }
        }

        const calculations = new Calculator(
            parseFloat(this.state.activeInvestment),
            this.state.feeRates[this.state.activeFeeRate].value,
            this.state.marginMultipliers[this.state.activeMarginMultiplier].value,
            this.state.incomeTaxRates[this.state.activeIncomeTaxRate].value
        );

        const newOutputs = this.state.outputs.map(o => {
            o.value = calculations[o.id];
            return o;
        });

        this.setState({ outputs: [...newOutputs] });
    }

    inputKeyboardShortcuts(e) {
        if (/Delete|Escape/.test(e.code.slice()) === true) this.setState({ activeInvestment: '' }, this.updateCalculations);
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

    updateActiveFeeRate(e) {
        this.setState({ activeFeeRate: +e.target.dataset.index }, this.updateCalculations);
    }

    updateActiveIncomeTaxRate(e) {
        this.setState({ activeIncomeTaxRate: +e.target.dataset.index }, this.updateCalculations);
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
                                label={this.state.useOptionsLabels ? this.state.feeRates[this.state.activeFeeRate].label : null}
                                items={this.state.feeRates}
                                clickEvent={this.updateActiveFeeRate}
                                dataIndex={true}
                            />
                            <Dropdown
                                label={this.state.useOptionsLabels ? this.state.incomeTaxRates[this.state.activeIncomeTaxRate].label : null}
                                items={this.state.incomeTaxRates}
                                clickEvent={this.updateActiveIncomeTaxRate}
                                dataIndex={true}
                            />
                            <Dropdown
                                label={this.state.useOptionsLabels ? this.state.marginMultipliers[this.state.activeMarginMultiplier].label : null}
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
                                            type="text"
                                            className="text-primary"
                                            placeholder="0"
                                            value={this.state.activeInvestment}
                                            onKeyDown={this.inputKeyboardShortcuts}
                                            onInput={this.inputFilter}
                                        />
                                    </div>
                                    <div className="col-2 center-y-row end p-1 row">
                                        <div className="wrapper">
                                            <Dropdown items={this.state.outputs} clickEvent={this.toggleOutputVisibility} dataIndex={true} right={true} />
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
