
function initializeCex(indicatorList, entity, period, turnover, marginRate, feesPersonnal, feesMaterial) {
  const cex = {
    entity: entity,
    period: period,
    turnover: turnover,
    marginRate: marginRate,
    feesPersonnal: feesPersonnal,
    feesMaterial: feesMaterial,
  }
  indicatorList.forEach(indicator => {
    if (!indicator.formula && !cex[indicator.name]) {
      cex[indicator.name] = indicator.default ? indicator.default : 0;
    }
  });
  return cex;
};

function calculateCex(cex, orderedFormulaList) {
  orderedFormulaList.forEach(currentformula => {
    cex[currentformula.name] = eval(currentformula.formula);
  });
  return cex;
};

function generateKey(entity, period, indicator) {
  return entity + "/" + period + "/" + indicator;
}

function modifyCexValue(cexList, keyCexToModify, value, orderedFormulaList) {
  const [entity, period, indicator] = keyCexToModify.split("/");
  console.log("changeCexValue: entity=", entity, ", period=", period, ", indicator=", indicator, ", value=", value);
  const newCexList = cexList.map(cex => {
    if (cex.entity === entity && cex.period === period) {
      console.log("Cex before=", cex);
      cex[indicator] = parseFloat(value);
      console.log("Cex after=", cex);
      return calculateCex(cex, orderedFormulaList);
    } else {
      return cex;
    }
  });
  return newCexList;
}


module.exports = {
  initializeCex: initializeCex,
  calculateCex: calculateCex,
  generateKey: generateKey,
  modifyCexValue: modifyCexValue,
}
