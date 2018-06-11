import React, { Component } from 'react';
import './App.css';
import Cex from './Cex';

class CellCex extends Component {
  constructor(props) {
    super(props);
    //console.log("cell cex=", props.cex, ", indicator", props.indicator);
    this.state = {
      value: Math.round(props.value),
      initialValue: Math.round(props.value),
      changed: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(props) {
    const newValue = Math.round(props.value);
    this.setState({
      value: newValue,
      changed: this.state.initialValue !== newValue,
    })
  }

  checkFormat(value) {
    //const re = /(\b[a-z](?!\s))/g;
    //return value.replace(re, function(x){return x.toUpperCase();});
    //const re = /^(?:0|(?:-?[1-9][0-9]*(?:\.[0-9]{1,2})?))$/;

    return value;
  }

  handleChange(event) {
    //console.log("handleChange: event.target.id=",event.target.id);
    this.setState({value: this.checkFormat(event.target.value)});
  }

  handleFocus(event) {
    //console.log("handleFocus: event.target.id=",event.target.id);
    this.setState({valueOnFocus: this.state.value});
  }

  handleBlur(event) {
    //console.log("handleBlur: event.target.id=",event.target.id);
    if (this.state.valueOnFocus !== this.state.value) {
      //console.log("handleBlur: value is modified");
      this.props.changeCexValue(event.target.id, this.state.value);
    }
  }

  render() {
    let csstd = "cell-cex";
    let cssinput = "";
    if (this.props.indicator.changeable) {
      csstd += " cell-cex-changeable";
    }
    if (this.state.changed) {
      csstd += " cell-cex-changed";
      cssinput += " cell-cex-changed";
    }
    return (
      this.props.indicator.changeable
        ? <td className={csstd}>
            <input
              id={Cex.generateKey(this.props.entity, this.props.period, this.props.indicator.name)}
              type="text"
              value={this.state.value}
              className={cssinput}
              onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}/>
          </td>
        : <td className={csstd}>
            <span id={Cex.generateKey(this.props.entity, this.props.period, this.props.indicator.name)}>
              {this.state.value}
            </span>
          </td>
    );
  }
}


class IndicatorRow extends Component {
  render() {
    return (
      <tr>
        <th scope="row">{this.props.indicator.name}</th>
        {this.props.cexList.map(currentCex =>
          <CellCex
            key={Cex.generateKey(currentCex.entity, currentCex.period, this.props.indicator.name)}
            entity={currentCex.entity}
            period={currentCex.period}
            value={currentCex[this.props.indicator.name]}
            indicator={this.props.indicator}
            changeCexValue={this.props.changeCexValue}/>
        )}
      </tr>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cexList: props.cexList,
    };
    this.changeCexValue = this.changeCexValue.bind(this);
  }

  changeCexValue(key, value) {
    const newCexList = Cex.modifyCexValue(this.state.cexList, key, value, this.props.formulaList);
    this.setState({
      cexList: [...newCexList],
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <table className="table table-sm">
          <thead className="thead-light">
            <tr>
              <th className="col-sm-1">#</th>
              {this.state.cexList.map((cex, index) =>
                <th key={index} className="col-sm-1"><div>{cex.entity}</div><div>{cex.period}</div></th>)
              }
            </tr>
          </thead>
          <tbody>
            {this.props.indicatorList.map(indicator =>
              <IndicatorRow key={indicator.name} indicator={indicator} cexList={this.state.cexList} changeCexValue={this.changeCexValue}/>)
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
