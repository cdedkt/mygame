import Display from "./Display";
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
//const orderedFormulaList2 = Cex.generateOrderedFormulaList(indicatorList2);

const display1 = new Display(1, "Cex complet", indicatorList1);
const display2 = new Display(2, "Cex simplifié", indicatorList2);

export const displayList = [display1, display2];


export const cexList = [];
for (let i=1; i<=52; i=i+2) {
  const period1 = "2018_" + i.toString();
  const period2 = "2018_" + (i+1).toString();
  cexList.push(Cex.calculateCex(Cex.initializeCex(indicatorList1, "mag_1", period1, 1000.60, 40.5, 10.10, 5.5), displayList[0].orderedFormulaList));
  cexList.push(Cex.calculateCex(Cex.initializeCex(indicatorList1, "mag_1", period2, 2000.60, 60, 20.20, 5.8), displayList[0].orderedFormulaList));
}
