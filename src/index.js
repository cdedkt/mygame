import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Cex from './Cex';

const indicatorList1 = [
  {name: "rbe", formula: "margin-feesTotal"},
  {name: "turnover", changeable: true},
  {name: "marginRate"},
  {name: "margin", formula: "turnover*marginRate/100"},
  {name: "feesPersonnal", changeable: true},
  {name: "feesMaterial"},
  {name: "feesTotal", formula: "feesPersonnal+feesMaterial"},
  {name: "rateFeesMargin", formula: "feesTotal/margin*100"},
  {name: "rbe.", formula: "margin-feesTotal"},
  {name: "otherFees", changeable: true},
  {name: "fees100", hidden: true, default: 100},
  {name: "feesTotal2", formula: "feesTotal+otherFees+fees100"},
  {name: "rbe2", formula: "margin-feesTotal2"},
];
const orderedFormulaList1 = Cex.generateOrderedFormulaList(indicatorList1);

const indicatorList2 = [
  {name: "turnover"},
  {name: "marginRate"},
  {name: "margin", formula: "turnover*marginRate/100"},
  {name: "feesPersonnal", hidden: true},
  {name: "feesMaterial", hidden: true},
  {name: "feesTotal", hidden: true, formula: "feesPersonnal+feesMaterial"},
  {name: "rateFeesMargin", hidden: false, formula: "feesTotal/margin*100"},
  {name: "rbe", formula: "margin-feesTotal"},
];
const orderedFormulaList2 = Cex.generateOrderedFormulaList(indicatorList2);

const cexList = [];
for (let i=1; i<=52; i=i+3) {
  const period1 = "2018_" + i.toString();
  const period2 = "2018_" + (i+1).toString();
  const period3 = "2018_" + (i+2).toString();
  cexList.push(Cex.calculateCex(Cex.initializeCex(indicatorList1, "mag_1", period1, 1000.60, 40.5, 10.10, 5.5), orderedFormulaList1));
  cexList.push(Cex.calculateCex(Cex.initializeCex(indicatorList1, "mag_1", period2, 2000.60, 60, 20.20, 5.8), orderedFormulaList1));
  cexList.push(Cex.calculateCex(Cex.initializeCex(indicatorList1, "mag_1", period3, 3000.60, 30, 20.20, 10.5), orderedFormulaList1));
}

ReactDOM.render(
  <App
    cexList={cexList}
    indicatorList1={indicatorList1}
    orderedFormulaList1={orderedFormulaList1}
    indicatorList2={indicatorList2}
    orderedFormulaList2={orderedFormulaList2}
  />, document.getElementById('root'));
registerServiceWorker();
