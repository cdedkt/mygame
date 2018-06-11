import React, { Component } from 'react';
import './App.css';
import Cex from './Cex';

function getColDefinition(index) {
  const colDefinition = "col-3 col-sm-2 col-md-1";
  if (index === "indicator") {
    return colDefinition;
  }
  if (index > 4) {
    return colDefinition + " d-none d-md-block";
  }
  if (index > 2) {
    return colDefinition + " d-none d-sm-block";
  }
  return colDefinition;
}

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
    let csstext = "cell-cex";
    let cssinput = "";
    if (this.props.indicator.changeable) {
      csstext += " cell-cex-changeable";
    }
    if (this.state.changed) {
      csstext += " cell-cex-changed";
      cssinput += " cell-cex-changed";
    }
    return (
      this.props.indicator.changeable
        ? <div className={this.props.classColName}>
            <div>
              <input
                id={Cex.generateKey(this.props.entity, this.props.period, this.props.indicator.name)}
                type="text"
                value={this.state.value}
                className={cssinput}
                onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}
                style={{width:'70px'}}/>
            </div>
          </div>
        : <div className={this.props.classColName}>
            <span id={Cex.generateKey(this.props.entity, this.props.period, this.props.indicator.name)} className={csstext}>
              {this.state.value}
            </span>
          </div>
    );
  }
}




class IndicatorRow extends Component {
  render() {
    return (
      <div className="row mt-1">
        <div className={getColDefinition("indicator")}>{this.props.indicator.name}</div>
        {this.props.cexList.map((currentCex, index) =>
          <CellCex
            key={Cex.generateKey(currentCex.entity, currentCex.period, this.props.indicator.name)}
            entity={currentCex.entity}
            period={currentCex.period}
            value={currentCex[this.props.indicator.name]}
            indicator={this.props.indicator}
            classColName={getColDefinition(index)}
            changeCexValue={this.props.changeCexValue}/>
        )}
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cexList: props.cexList,
      displayCexFirst: 0,
      displayCexLength : 11,

    };
    this.changeCexValue = this.changeCexValue.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }

  changeCexValue(key, value) {
    const newCexList = Cex.modifyCexValue(this.state.cexList, key, value, this.props.formulaList);
    this.setState({
      cexList: [...newCexList],
    });
  }

  moveLeft(nb) {
    //console.log("moveLeft", nb);
    if (this.state.displayCexFirst > nb - 1) {
      //console.log(nb);
      this.setState({displayCexFirst: this.state.displayCexFirst - nb});
    } else {
      this.setState({displayCexFirst: 0});
    }
  }
  moveRight(nb) {
    //console.log("moveRight", nb);
    if (this.state.displayCexFirst < this.state.cexList.length - this.state.displayCexLength) {
      console.log(nb);
      this.setState({displayCexFirst: this.state.displayCexFirst + nb});
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="container">
          <button type="button" className="btn btn-secondary" onClick={() => this.moveLeft(3)}>&lt;&lt;&lt;</button>
          <button type="button" className="btn btn-secondary ml-1" onClick={() => this.moveLeft(1)}>&lt;</button>
          <span className="ml-3 mr-3" >{this.state.cexList[this.state.displayCexFirst].period}</span>
          <button type="button" className="btn btn-secondary" onClick={() => this.moveRight(1)}>&gt;</button>
          <button type="button" className="btn btn-secondary ml-1" onClick={() => this.moveRight(3)}>&gt;&gt;&gt;</button>
        </div>

        <div className="row mt-3 cell-header">
          <div className={getColDefinition("indicator")}>Indicator</div>
          {this.state.cexList.slice(this.state.displayCexFirst, this.state.displayCexFirst+this.state.displayCexLength).map((cex, index) =>
            <div key={index} className={getColDefinition(index)}><div>{cex.entity}</div><div>{cex.period}</div></div>)
          }
        </div>

        {this.props.indicatorList.map(indicator =>
          <IndicatorRow
            key={indicator.name}
            indicator={indicator}
            cexList={this.state.cexList.slice(this.state.displayCexFirst, this.state.displayCexFirst+this.state.displayCexLength)}
            changeCexValue={this.changeCexValue}/>)
        }

      </div>
    );
  }
}

export default App;
