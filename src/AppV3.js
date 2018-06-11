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
    //console.log("handleChange: event.target.id=",event.target.id, event.target.value);
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
        ? <div className={this.props.config.nbColCex.definition}>
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
        : <div className={this.props.config.nbColCex.definition}>
            <span id={Cex.generateKey(this.props.entity, this.props.period, this.props.indicator.name)} className={csstext}>
              {this.state.value}
            </span>
          </div>
    );
  }
}




class IndicatorRow extends Component {
  render() {
    let rowClassName = "row mt-1 ";
    if (this.props.indicator.hidden) {
      rowClassName += " d-none";
    }
    return (
      <div className={rowClassName}>
        <div className={this.props.config.nbColCex.definition}>{this.props.indicator.name}</div>
        {this.props.cexList.map((currentCex, index) =>
          <CellCex
            key={Cex.generateKey(currentCex.entity, currentCex.period, this.props.indicator.name)}
            entity={currentCex.entity}
            period={currentCex.period}
            value={currentCex[this.props.indicator.name]}
            indicator={this.props.indicator}
            config={this.props.config}
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
      config: {
        windowInformation: {},
        nbColCex: {
          xl: 11,
          lg: 11,
          md: 11,
          sm: 5,
          xs: 3,
          definition: "col-3 col-sm-2 col-md-1",
        },
      },
      cexList: this.props.cexList,
      displayCexFirst: 0,
      displayCexLength: 0,
      indicatorList: this.props.indicatorList1,
      orderedFormulaList: this.props.orderedFormulaList1,
    };
    this.changeCexValue = this.changeCexValue.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
  }

  updateDimensions() {
    //console.log("updateDimensions");
    let media = "";
    if (window.innerWidth >= 1200) {
      media = "xl";
    } else if (window.innerWidth >= 992) {
      media = "lg";
    } else if (window.innerWidth >= 768) {
      media = "md";
    } else if (window.innerWidth >= 576) {
      media = "sm";
    } else {
      media = "xs";
    }
    const windowInformation = {
      width: window.innerWidth,
      height: window.innerHeight,
      media: media
    }
    //console.log("windowInformation=", windowInformation);
    this.setState({
      config: {...this.state.config, windowInformation: windowInformation},
      displayCexLength: this.state.config.nbColCex[media],
    });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }


  changeCexValue(key, value) {
    //console.log("changeCexValue: key=", key, ", value=", value);
    const newCexList = Cex.modifyCexValue(this.state.cexList, key, value, this.state.orderedFormulaList);
    this.setState({
      cexList: [...newCexList],
    });
  }

  moveLeft(nb) {
    //console.log("moveLeft", nb);
    if (this.state.displayCexFirst > nb - 1) {
      //console.log("moveLeft GO);
      this.setState({displayCexFirst: this.state.displayCexFirst - nb});
    } else {
      this.setState({displayCexFirst: 0});
    }
  }
  moveRight(nb) {
    //console.log("moveRight", nb);
    if (this.state.displayCexFirst < this.state.cexList.length - this.state.displayCexLength) {
      //console.log("moveRight GO);
      this.setState({displayCexFirst: this.state.displayCexFirst + nb});
    }
  }

  changeDisplay(nb) {
    if (nb === 1) {
      this.setState({
        indicatorList: this.props.indicatorList1,
        orderedFormulaList: this.props.orderedFormulaList1
      });
    }
    if (nb === 2) {
      this.setState({
        indicatorList: this.props.indicatorList2,
        orderedFormulaList: this.props.orderedFormulaList2
      });
    }
  }

  render() {
    //col-3 col-sm-2 col-md-1
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-sm-3">
            <div className="container">
              <div className="">width: {this.state.config.windowInformation.width}</div>
              <div className="">height: {this.state.config.windowInformation.height}</div>
              <div className="">media: {this.state.config.windowInformation.media}</div>
            </div>
          </div>

          <div className="col-12 col-sm-6">
            <div className="container">
              <button type="button" className="btn btn-secondary" onClick={() => this.moveLeft(3)}>&lt;&lt;&lt;</button>
              <button type="button" className="btn btn-secondary ml-1" onClick={() => this.moveLeft(1)}>&lt;</button>
              <span className="ml-3 mr-3" >{this.state.cexList[this.state.displayCexFirst].period}</span>
              <button type="button" className="btn btn-secondary" onClick={() => this.moveRight(1)}>&gt;</button>
              <button type="button" className="btn btn-secondary ml-1" onClick={() => this.moveRight(3)}>&gt;&gt;&gt;</button>
            </div>
          </div>

          <div className="col-12 col-sm-3">
            <div className="container">
              <button type="button" className="btn btn-secondary mr-1" onClick={() => this.changeDisplay(1)}>Display 1</button>
              <button type="button" className="btn btn-secondary" onClick={() => this.changeDisplay(2)}>Display 2</button>
            </div>
          </div>
        </div>

        <div className="row mt-3 cell-header">
          <div className={this.state.config.nbColCex.definition}>Indicator</div>
          {this.state.cexList.slice(this.state.displayCexFirst, this.state.displayCexFirst+this.state.displayCexLength).map((cex, index) =>
            <div key={index} className={this.state.config.nbColCex.definition}>
              <div>{cex.entity}</div>
              <div>{cex.period}</div>
            </div>)
          }
        </div>

        {this.state.indicatorList.map(indicator =>
          <IndicatorRow
            key={indicator.name}
            indicator={indicator}
            cexList={this.state.cexList.slice(this.state.displayCexFirst, this.state.displayCexFirst+this.state.displayCexLength)}
            config={this.state.config}
            changeCexValue={this.changeCexValue}/>)
        }

        <div className="row mt-3 cell-header">
          <div className="container mt-3">
            <textarea style={{width:600, height:200}} value={JSON.stringify(this.state.indicatorList).replace(new RegExp("},","g"), "},\n")} readOnly/>
          </div>
        </div>
      </div>


    );
  }
}

export default App;
