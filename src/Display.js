class Display {
  constructor(id, name, indicatorList) {
    this.id = id;
    this.name = name;
    this.indicatorList = indicatorList;
    this.orderedFormulaList = this.generateOrderedFormulaList()
  }

  generateOrderedFormulaList() {
    function dependanceIndicator(indicator) {
      var regexDecoupe = /\s?([///*+-])\s?/;
      var resSplit = indicator.formula.split(regexDecoupe);
      //console.log("decoupe [",indicator.formula, "] = ", resSplit);
      const subIndicatorList = [];
      let formulaWithCex = "";
      resSplit.forEach(element => {
        if (isNaN(element) && (element !== "+") && (element !== "-") && (element !== "*") && (element !== "/")) {
          formulaWithCex += "cex.";
          subIndicatorList.push(element);
        }
        formulaWithCex += element;
      });
      return {formulaWithCex, subIndicatorList};
    }

    const orderedFormulaList = [];
    const indicatorList = this.indicatorList.slice(0).filter(element => element.formula);
    //console.log("generateOrderedFormulaList: indicatorList=", indicatorList);
    let nbIteration = 0;
    while (indicatorList.length > 0 && nbIteration < 100) {
      nbIteration++;
      const currentIndicator = indicatorList.shift();
      if (currentIndicator.formula) {
        const dependancedescription = dependanceIndicator(currentIndicator);
        //console.log("generateOrderedFormulaList: dependancedescription=", currentIndicator.name, dependancedescription);
        let hasDependance = false;
        dependancedescription.subIndicatorList.forEach(subIndicator => {
          if (indicatorList.findIndex(indicator =>
            { if (indicator.name === subIndicator) {
                //console.log("subIndicator=", subIndicator, "HAS dependance with indicator.name=", indicator.name);
                return true;
              } else {
                //console.log("subIndicator=", subIndicator, "has no dependance with indicator.name=", indicator.name);
                return false;
              }
            })  >= 0) {
            //console.log("hasDependance: ", currentIndicator.name, dependancedescription.formulaWithCex);
            hasDependance = true;
          }
        });
        if (!hasDependance) {
          orderedFormulaList.push({name: currentIndicator.name, formula: dependancedescription.formulaWithCex})
        } else {
          indicatorList.push(currentIndicator);
        }
      }
    }
    if (nbIteration >= 100) {
      console.log("ERROR : BOUCLE BOUCLE BOUCLE");
      return;
    } else {
      //console.log("orderedFormulaList=", orderedFormulaList);
      return orderedFormulaList;
    }
  }
}

export default Display;
