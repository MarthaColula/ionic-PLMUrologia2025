import { UtilitiesTools } from '../interfaces/utilities-tools';

export class UtilitiesCalculator {

  protected utilities = new UtilitiesTools();

  chkUpdateResponse(currentReagent: any, currentResp: any) {
    let strValue = currentResp.value + '';
    console.warn('***  currentResp-value: ' + strValue);
    if (currentReagent && currentResp) {
      currentReagent.Items.forEach((item: any) => {
        if (strValue && item.Value === strValue) {
          if (this.existInJSON(currentResp,'finalOption')) {
            currentResp.finalOption = item.FinalOption;
          }
          if (this.existInJSON(currentResp,'focus')) {
            currentResp.focus = item.FocusResult;
          }
          if (this.existInJSON(item,'"FlagOption"') && this.existInJSON(currentResp,'flagOption')) {
            currentResp.flagOption = item.FlagOption;
          }
        }
      });
    }
    return currentResp;
  }
  
  chkClnFinalOption(currentArrayCheck: any) {
    let countCheck = 0;
    currentArrayCheck.forEach((itemCheck: any) => {
      if (itemCheck.Checked) {
        countCheck++;
      }
    });
    return (countCheck>1);
  }

  concatenateStrings(arraryStrings: any, strSeparator: string) {
      return this.utilities.concatenateStrings(arraryStrings,strSeparator);
  }
  
  existInJSON(jsonOBJ: any, strTag: string) {
    return this.utilities.existInJSON(jsonOBJ,strTag);
  }
  
  existParamInArray(arrayParams: Array<any>, strParam: string) {
    let exists = false;
    for(let indxRsp = 0; indxRsp < arrayParams.length; indxRsp++) {
      const param = arrayParams[indxRsp];
      if (strParam === param) {
        exists = true;
        break;
      }
    }
    return exists;
  }
  
  existParamInResponses(arrayResponses: Array<any>, strParam: string) {
    let exists = false;
    for(let indxRsp = 0; indxRsp < arrayResponses.length; indxRsp++) {
      const response = arrayResponses[indxRsp];
      console.warn({response: response});
      if (strParam === response.param) {
        let strValue = ''+response.value;
        if (strValue) {
          exists = true;
          break;
        }
      }
    }
    return exists;
  }

  getArrayElementsHTML() {
    return this.utilities.arrayElementsHTML;
  }

  getArrayExcludingParameters(arrayListReagents: Array<Array<any>>, strParam: string, anyValue: any) {
    let strParamsCln: string = '';
    if (arrayListReagents && arrayListReagents.length > 0) {
      let nxtCndtn = -1;
      let arryNxtOptn: Array<any> = [];
      arrayListReagents.forEach((lstReagents) => {
        lstReagents.forEach((rgntRst) => {
          if (rgntRst.Param === strParam) {
            strParamsCln = rgntRst.NoReagent +','+ strParam;
            if (this.existInJSON(rgntRst,'ConditionalOption')) {
              if (this.existInJSON(rgntRst,'NextCondition')) {
                nxtCndtn = rgntRst.NextCondition;
              } else {
                let fnlOption = false;
                rgntRst.Items.forEach((item: any) => {
                  if (item.Value == anyValue && this.existInJSON(item,'ChangeNext')) {
                    console.warn({item: item});
                    if (this.existInJSON(item,'FinalOption')) {
                      fnlOption = item.FinalOption;
                    }
                  }
                });
                console.warn('***  fnlOption: ' + fnlOption);
                if (fnlOption) {
                  for(let indxItm = 0; indxItm < rgntRst.Items.length; indxItm++) {
                    const crrntItm = rgntRst.Items[indxItm];
                    if (crrntItm.Value != anyValue && this.existInJSON(crrntItm,'ChangeNext')
                    && this.existInJSON(crrntItm,'FinalOption') && !crrntItm.FinalOption) {
                      console.warn({crrntItm: crrntItm});
                      nxtCndtn = crrntItm.ChangeNext;
                      break;
                    }
                  }
                }
              }
            } else if (this.existInJSON(rgntRst,'ValidateConditions')) {
              nxtCndtn = rgntRst.NextCondition;
            } else if (this.existInJSON(rgntRst,'ChangeOption')) {
              rgntRst.Items.forEach((item: any) => {
                if (this.existInJSON(item,'ChangeNext')) {
                  arryNxtOptn.push(item.ChangeNext);
                }
              });
            }
          } if (nxtCndtn > 0 && rgntRst.NoReagent == nxtCndtn) {
            strParamsCln += '|'+ rgntRst.NoReagent +','+ rgntRst.Param;
          } else if (arryNxtOptn.length > 0) {
            arryNxtOptn.forEach((nxtOptn) => {
              if (rgntRst.NoReagent == nxtOptn) {
                strParamsCln += '|'+ rgntRst.NoReagent +','+ rgntRst.Param;
              }
            });
          }
        });
      });
    }
    return strParamsCln;
  }

  getArrayFromString(srtArray: string, separator: string) {
    return this.utilities.getArrayFromString(srtArray,separator);
  }

  getArrayIndexCleanNext(strParams: string, crrntParam: string, nxtView: any) {
    let arrayIndexClnNxt: any;
    if (strParams) {
      let arryParams: any;
      let arryStr: any;
      if (strParams.includes('|')) {
        arryParams = strParams.split('|');
        arryParams.forEach((subStr: any) => {
          let arryStr: any;
          if (!subStr.includes(crrntParam) && subStr.includes(',')) {
            arryStr = subStr.split(',');
            /*let tmpStr = arryStr[1];
            if (tmpStr && crrntParam != tmpStr) {
              let tmpNxt = parseInt(arryStr[0]);
              if (nxtView && tmpNxt != nxtView) {
                if (!arrayIndexClnNxt) {
                  arrayIndexClnNxt = [];
                }
                arrayIndexClnNxt.push(parseInt(arryStr[0]));
              }
            }*/
            let tmpNxt = parseInt(arryStr[0]);
            if (nxtView && tmpNxt === nxtView) {
              if (!arrayIndexClnNxt) {
                arrayIndexClnNxt = [];
              }
              arrayIndexClnNxt.push(parseInt(arryStr[0]));
            }
          }
        });
      }
    }
    return arrayIndexClnNxt;
  }

  getArrayResponsesCleanParameters(arrayResponses: Array<any>, strParamEnd: string) {
    if (arrayResponses && arrayResponses.length > 0) {
      let newArrayResponses: Array<any> = [];
      for(let indxResp = 0; indxResp < arrayResponses.length; indxResp++) {
        const crrntResp = arrayResponses[indxResp];
        newArrayResponses.push(crrntResp);
        if (crrntResp.param === strParamEnd) {
          break;
        }
      }
      if (newArrayResponses.length < arrayResponses.length) {
        arrayResponses = [];
        arrayResponses = newArrayResponses;
      }
    }
    return arrayResponses;
  }

  getArrayResponsesExcludingParameters(arrayResponses: Array<any>, strParamsCln: string) {
    if (arrayResponses && arrayResponses.length > 0) {
      let newArrayResponses: Array<any> = [];
      let flgExclude = false;
      arrayResponses.forEach((resp) => {
        const crrntResp = resp;
        const strParam = ''+crrntResp.param;
        flgExclude = (strParamsCln.includes(strParam) ? true : false);
        if (!flgExclude) {
          newArrayResponses.push(crrntResp);
        }
      });
      if (newArrayResponses.length < arrayResponses.length) {
        arrayResponses = [];
        arrayResponses = newArrayResponses;
        console.warn('***  arrayResponses-length: ' + arrayResponses.length);
      }
    }
    return arrayResponses;
  }

  getChangeResult(reagent: any, flgFinalOption: boolean, flgScore: boolean, flgFocus: boolean, flgOption: boolean, strValue: any, score: any, strValue2: string, condtnlOption: boolean, nextCondtn: any, indxItems: any, showOption: any, strError: any, flgInc: boolean, increase: any) {
    let nxtReagent: any;
    let showOptionalReagent: any;
    console.warn('***  flgFinalOption: ' + flgFinalOption);
    console.warn('***  flgScore: '+ flgScore +', flgFocus: ' + flgFocus +', flgOption: ' + flgOption);
    console.warn('***  nextCondtn: ' + nextCondtn);
    console.warn('***  condtnlOption: '+ condtnlOption +', strValue: ' + strValue);
    if (condtnlOption && strValue) {
      nxtReagent = nextCondtn;
      showOptionalReagent = true;
    } else if (condtnlOption) {
      nxtReagent = nextCondtn;
      showOptionalReagent = false;
    }
    console.log('***  showOption: ' + showOption);
    if((showOption+'') != 'undefined') {
      showOptionalReagent = showOption;
    }
    if(strValue2) {
      console.warn('***  strValue2: ' + strValue2);
    }
    console.warn({reagent: reagent});
    let noRgnt = reagent.NoReagent;
    console.log('***  noRgnt: ' + noRgnt);
    let finalOption = flgFinalOption;
    console.log('***  finalOption: ' + finalOption);
    let focusResult = flgFocus;
    console.log('***  focusResult: ' + focusResult);
    let itemResult: any;
    if (flgScore && score && condtnlOption) {
      console.log('***  strValue2-One: ' + strValue2);
      if (strValue2) {
        itemResult = {
          response: { param: reagent.Param, value: strValue2, score: score, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type },
          page: { flgInc: flgInc, increase: increase, index: indxItems, next: nxtReagent, show: showOptionalReagent, error: strError}
        };
      } else {
        itemResult = {
          response: { param: reagent.Param, value: strValue, score: score, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type },
          page: { flgInc: flgInc, increase: increase, index: indxItems, next: nxtReagent, show: showOptionalReagent, error: strError}
        };
      }
    } else if (flgScore && score) {
      console.log('***  strValue2-Two: ' + strValue2);
      if (strValue2) {
        itemResult = {
          response: { param: reagent.Param, value: strValue2, score: score, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type },
          page: { flgInc: flgInc, increase: increase, index: indxItems, noReagent: noRgnt, error: strError }
        };
      } else {
        itemResult = {
          response: { param: reagent.Param, value: strValue, score: score, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type },
          page: { flgInc: flgInc, increase: increase, index: indxItems, noReagent: noRgnt, error: strError }
        };
      }
    } else if (condtnlOption && reagent.Parse) {
      console.log('***  strValue2-Three: ' + strValue2);
      if (strValue2) {
        itemResult = {
          response: { param: reagent.Param, value: strValue2, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type, str: true },
          page: { flgInc: flgInc, increase: increase, index: indxItems, next: nxtReagent, show: showOptionalReagent, error: strError }
        };
      } else {
        itemResult = {
          response: { param: reagent.Param, value: strValue, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type, str: false },
          page: { flgInc: flgInc, increase: increase, index: indxItems, next: nxtReagent, show: showOptionalReagent, error: strError }
        };
      }
    } else if (condtnlOption) {
      console.log('***  strValue2-Four: ' + strValue2);
      if (strValue2) {
        itemResult = {
          response: { param: reagent.Param, value: strValue2, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type, str: true },
          page: { flgInc: flgInc, increase: increase, index: indxItems, next: nxtReagent, show: showOptionalReagent, error: strError }
        };
      } else {
        itemResult = {
          response: { param: reagent.Param, value: strValue, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type, str: false },
          page: { flgInc: flgInc, increase: increase, index: indxItems, next: nxtReagent, show: showOptionalReagent, error: strError }
        };
      }
    } else if (reagent.Parse) {
      itemResult = {
        response: { param: reagent.Param, value: strValue, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type, str: false },
        page: { flgInc: flgInc, increase: increase, index: indxItems, noReagent: noRgnt, error: strError }
      };
    } else {
      itemResult = {
        response: { param: reagent.Param, value: strValue, finalOption: finalOption, focus: focusResult, flagOption: flgOption, type: reagent.Type, str: true },
        page: { flgInc: flgInc, increase: increase, index: indxItems, noReagent: noRgnt, error: strError }
      };
    }
    console.warn({itemResult: itemResult});
    return itemResult;
  }

  getCaseResult(reagent: any, strValue: string, indxItems: any, nextReagent: any, condtnlOption: any) {
    let showOptionalReagent: any;
    console.warn('***  condtnlOption: ' + condtnlOption);
    if (condtnlOption) {
      showOptionalReagent = true;
    } else if (condtnlOption) {
      showOptionalReagent = false;
    }
    console.log('***  showOptionalReagent: ' + showOptionalReagent);
    let itemCaseResult: any;
    if (nextReagent > 0 && showOptionalReagent) {
      itemCaseResult = {
        response: { param: reagent.Param, value: strValue, type: reagent.Type },
        page: { index: indxItems, next: nextReagent, show: showOptionalReagent }
      };
    } else if (nextReagent > 0) {
      itemCaseResult = {
        response: { param: reagent.Param, value: strValue, type: reagent.Type },
        page: { index: indxItems, next: nextReagent }
      };
    } else if (indxItems > 0) {
      itemCaseResult = {
        response: { param: reagent.Param, value: strValue, type: reagent.Type },
        page: { index: indxItems }
      };
    }
    console.warn({itemCaseResult: itemCaseResult});
    return itemCaseResult;
  }

  getExcludeClnParamInResponses(arrayResponses: Array<any>, strParamsCln: string, strParam: string) {
    let excldClnPrm: any;
    if (strParamsCln && arrayResponses && arrayResponses.length > 0) {
      arrayResponses.forEach((resp) => {
        const strPrm = resp.param;
        if (strPrm != strParam && strParamsCln.includes(strPrm)) {
          excldClnPrm = strPrm;
        }
      });
    }
    return excldClnPrm;
  }

  getIndexCleanNext(strParams: string, crrntParam: string, nxtView: any, prevNxt: any) {
    let indexClnNxt = -1;
    if (strParams) {
      let arryParams: any;
      let arryStr: any;
      if (strParams.includes('|')) {
        arryParams = strParams.split('|');
        arryParams.forEach((subStr: string) => {
          if (subStr.includes(',')) {
            arryStr = subStr.split(',');
            let tmpStr = arryStr[1];
            if (tmpStr && crrntParam != tmpStr) {
              let tmpNxt = parseInt(arryStr[0]);
              if (nxtView && tmpNxt == nxtView) {
                indexClnNxt = parseInt(arryStr[0]);
              } else if (prevNxt && tmpNxt == prevNxt) {
                indexClnNxt = parseInt(arryStr[0]);
              } else if (!nxtView) {
                indexClnNxt = parseInt(arryStr[0]);
              }
            }
          }
        });
      } else if (strParams.includes(',')) {
        arryStr = strParams.split(',');
        indexClnNxt = parseInt(arryStr[0]);
      }
    }
    return indexClnNxt;
  }

  getParamsJSON(arrayResponses: any) {
    let paramsJSON: any;
    if (arrayResponses && arrayResponses.length > 0) {
      let strJsonParams = '';
      arrayResponses.forEach((resp: any) => {
        if ((JSON.stringify(resp)).includes('str') && resp.str) {
          if (strJsonParams != '') {
            strJsonParams += ',"'+ resp.param +'":\"'+ resp.value +'\"';
          } else {
            strJsonParams = '"'+ resp.param +'":\"'+ resp.value +'\"';
          }
        } else if (!this.validateStringIsNumber(resp.value.toString())) {
          if (strJsonParams != '') {
            strJsonParams += ',"'+ resp.param +'":\"'+ resp.value +'\"';
          } else {
            strJsonParams = '"'+ resp.param +'":\"'+ resp.value +'\"';
          }
        } else {
          if (strJsonParams != '') {
            strJsonParams += ',"'+ resp.param +'":'+ resp.value;
          } else {
            strJsonParams = '"'+ resp.param +'":'+ resp.value;
          }
        }
      });
      strJsonParams = '{' + strJsonParams;
      strJsonParams += '}';
      //console.log('***  strJsonParams: ' + JSON.stringify(strJsonParams));
      paramsJSON = JSON.parse(strJsonParams);
    }
    return paramsJSON;
  }

  getPreviousReagentByIndexAndNoReagent(arrayListReagents: Array<Array<any>>, index: any, noReagent: any) {
    let previousReagent: any;
    if (arrayListReagents && arrayListReagents.length > 0) {
      let indxL = 0;
      arrayListReagents.forEach((lstReagents) => {
        for(let indxR = 0; indxR < lstReagents.length; indxR++) {
          const reagent = lstReagents[indxR];
          if (index && index > 0) {
            if (indxL == index && reagent.NoReagent == noReagent) {
              previousReagent = reagent;
              break;
            }
          } else {
            if (reagent.NoReagent == noReagent) {
              previousReagent = reagent;
              break;
            }
          }
        }
        indxL++;
      });
    }
    return previousReagent;
  }

  getPreviousReagentByParam(arrayListReagents: Array<Array<any>>, strParam: string) {
    let previousReagent: any;
    if (arrayListReagents && arrayListReagents.length > 0) {
      arrayListReagents.forEach((lstReagents) => {
        lstReagents.forEach((reagent) => {
          if (reagent.Param === strParam) {
            previousReagent = reagent;
          }
        });
      });
    }
    return previousReagent;
  }

  getResultsFromCase(itemsTableResults: Array<any>, flgScore: boolean, score: any, caseCmpr: any) {
    let txtResult = '';
    let strValues = '';
    let strObservation = '';
    let itemCase = '';
    let strScore = ''+score;
    let noCase = 0;
    console.warn('***  strScore: ' + strScore);
    for(let indxItm = 0; indxItm < itemsTableResults.length; indxItm++) {
      const item = itemsTableResults[indxItm];
      itemCase = item.Case.toString();
      noCase++;
      console.warn('***  itemCase: '+ itemCase +', caseCmpr: '+ caseCmpr +', score: '+ strScore);
      if (strScore && strScore != 'undefined') {
        let cmprMinor = 0;
        let cmprMajor = 0;
        if (itemCase.length > 1 && !itemCase.includes('|')) {
          if (!itemCase.includes('&') && itemCase.includes('[') && itemCase.includes(']')) {
            let arrayStrOne = itemCase.split(',');
            if (arrayStrOne && arrayStrOne.length > 0) {
              let strTmpMin = arrayStrOne[0].replace('[','');
              cmprMinor = parseFloat(strTmpMin);
              let strTmpMax = arrayStrOne[1].replace(']','');
              cmprMajor = parseFloat(strTmpMax);
            }
            console.warn('***  cmprMinor: '+ cmprMinor +', cmprMajor: '+ cmprMajor);
          } else if (itemCase.includes('&') && (itemCase.includes('<') || itemCase.includes('>'))) {
            let arrayStrTwo = itemCase.split('&');
            arrayStrTwo.forEach((strTmp) => {
              if (itemCase.includes('<') || itemCase.includes('<=')) {
                strTmp = strTmp.replace('<','');
                strTmp = strTmp.replace('=','');
                cmprMinor = parseFloat(strTmp);
              } else if ((itemCase.includes('>') || itemCase.includes('>='))) {
                strTmp = strTmp.replace('>','');
                strTmp = strTmp.replace('=','');
                cmprMajor = parseFloat(strTmp);
              }
            });
            console.warn('***  cmprMinor: '+ cmprMinor +', cmprMajor: '+ cmprMajor);
          } else if (!itemCase.includes('&') && (itemCase.includes('<') || itemCase.includes('>'))) {
            let tmpStr = itemCase;
            tmpStr = tmpStr.replace('<','');
            tmpStr = tmpStr.replace('>','');
            tmpStr = tmpStr.replace('=','');
            caseCmpr = parseFloat(tmpStr);
            console.warn('***  caseCmpr: ' + caseCmpr);
          }
        }
        console.warn('***  flgScore: ' + flgScore);
        let arrayIncludes = ['<=', '>=', '<', '>', '[', ']'];
        if (flgScore && this.validateStringIncludes(itemCase,arrayIncludes)) {
          console.warn('***  validation-score: ' + score);
          if (itemCase.includes('[') && itemCase.includes(']') && score >= cmprMinor && score <= cmprMajor) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes('<=') && itemCase.includes('>=') && score <= cmprMinor && score >= cmprMajor) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes('<') && itemCase.includes('>') && score < cmprMinor && score > cmprMajor) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes('<=') && score <= caseCmpr) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes('<') && score < caseCmpr) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes('>=') && score >= caseCmpr) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes('>') && score > caseCmpr) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          }
        } else if (flgScore) {
          console.warn('***  caseCmpr: ' + caseCmpr);
          if (!caseCmpr) {
            if (itemCase.includes('|')) {
              let arrayStrCase = itemCase.split('|');
              let strCaseOne = arrayStrCase[0];
              let flgNumber = this.validateStringIsNumber(strCaseOne);
              console.warn('***  flgNumber: ' + flgNumber);
              if (flgNumber && itemCase.includes(''+score)) {
                txtResult = item.TextResult;
                strValues = item.ValueResult;
                strObservation = item.Observation;
                break;
              }
            } else {
              let strScore = score.toString();
              console.warn('***  strScore: ' + strScore);
              if (itemCase === strScore) {
                txtResult = item.TextResult;
                strValues = item.ValueResult;
                strObservation = item.Observation;
                break;
              }
            }
          } else if (itemCase && itemCase.includes(caseCmpr)) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          }
        } else {
          if (itemCase && itemCase.includes(caseCmpr)) {
            txtResult = item.TextResult;
            strValues = item.ValueResult;
            strObservation = item.Observation;
            break;
          } else if (itemCase.includes(''+score)) {
            let strScore = score.toString();
            console.warn('***  strScore: ' + strScore);
            if (itemCase === strScore) {
              txtResult = item.TextResult;
              strValues = item.ValueResult;
              strObservation = item.Observation;
              break;
            }
          }
        }
      } else {
        if (itemCase.includes('|') && itemCase.includes(caseCmpr)) {
          txtResult = item.TextResult;
          strValues = item.ValueResult;
          strObservation = item.Observation;
          break;
        } else if (!itemCase.includes('|') && itemCase === caseCmpr) {
          txtResult = item.TextResult;
          strValues = item.ValueResult;
          strObservation = item.Observation;
          break;
        }
      }
    };
    const resultsObj = {
      case: noCase,
      result: txtResult,
      values: strValues,
      observation: strObservation
    };
    console.warn({results: resultsObj});
    return resultsObj;
  }

  getResultFromTableResults(arrayResponses: any, dataResults: any, tableResults: any, casesStr: string, flgScore: boolean, score: any) {
    console.log('***  getResultFromTableResults()  ***');
    console.log({responses: arrayResponses});
    let strTitle: any;
    let strResult: any;
    let strObservation: any;
    let caseCmpr: any;
    let noLegends = 0;
    if (this.existInJSON(dataResults,'"NoLegends"')) {
      noLegends = dataResults.NoLegends;
    }
    console.warn('***  casesStr: '+ casesStr +', score: ' + score);
    if (dataResults.Type == 'Legends') {
      console.warn('***  LEGENDS  ***');
      if (noLegends == 1) {
        console.warn('***  LEGEND ONE  ***');
        strResult = dataResults.Legends;
        let txtResult = '';
        let valResult = '';
        if (casesStr) {
          caseCmpr = casesStr;
        }
        console.warn('***  noLegends: '+ noLegends +', caseCmpr: ' + caseCmpr);
        if (tableResults && this.existInJSON(tableResults,'"Items"') && tableResults.Items.length > 0) {
          const results = this.getResultsFromCase(tableResults.Items,flgScore,score,caseCmpr);
          if (results) {
            txtResult = results.result;
            valResult = results.values;
          }
        } else {
          console.warn('***  Case No TableResults...');
          strResult = dataResults.Legends;
          if (flgScore && score) {
            if (strResult.includes('VALUE') && caseCmpr) {
              strResult = strResult.replace('VALUE',caseCmpr);
            }
          }
        }
        console.warn('***  strResult: '+ strResult +', txtResult: ' + txtResult);
        console.warn('***  strResult-length: ' + strResult.length);
        if (txtResult && strResult.includes('LEGEND') && strResult.length == 6) {
          strResult = txtResult;
        } else if (strResult) {
          if (strResult.includes('SCORE') && (score || score.toString() === '0')) {
            strResult = strResult.replace('SCORE',score);
          } else if (strResult.includes('VALUE') && valResult) {
            console.warn('***  valResult: ' + valResult);
            strResult = strResult.replace('VALUE',valResult);
          }
          if (strResult.includes('LEGEND')) {
            strResult = strResult.replace('LEGEND',txtResult);
          }
        }
        console.warn('***  strResult: ' + strResult);
        console.log({results: dataResults});
      } else {
        console.warn('***   TODO LEGENDS...  ***');
      }
    } else if (dataResults.Type == 'Table') {
      console.warn('***  TABLE  ***');
      let strCase = '';
      let bndCaseOption = false;
      if (this.existInJSON(dataResults,'"OptionCase"')) {
        let optionCase = dataResults.OptionCase.toString();
        console.log('***  optionCase: ' + optionCase);
        if (optionCase.includes('|')) {
          let strOptCase = optionCase.split('|');
          console.log('***  strOptCase-length: ' + strOptCase.length);
          let strOions: any;
          switch (strOptCase.length) {
            case 2:
              strOions = ['',''];
              console.log('***  arrayResponses-length: ' + arrayResponses.length);
              arrayResponses.forEach((resp: any) => {
                if (resp.param === strOptCase[0].toString()) {
                  strOions[0] = resp.value;
                } else if (resp.param === strOptCase[1].toString()) {
                  strOions[1] = resp.value;
                }
              });
              strCase = strOions[0] + strOions[1];
              break;
            case 3:
              strOions = ['',''];
              console.log('***  arrayResponses-length: ' + arrayResponses.length);
              arrayResponses.forEach((resp: any) => {
                if (resp.param === strOptCase[0].toString()) {
                  strOions[0] = resp.value;
                } else if (resp.param === strOptCase[1].toString()) {
                  strOions[1] = resp.value;
                }
              });
              strCase = strOions[0] + strOptCase[2] + strOions[1];
              break;
            default:
              console.warn('***  Caso no implementado!!');
              break;
          }
        } else {
          console.log('***  arrayResponses-length: ' + arrayResponses.length);
          arrayResponses.forEach((resp: any) => {
            if (resp.param == optionCase) {
              strCase = resp.value;
            }
          });
        }
      } else if (this.existInJSON(dataResults,'"FlagCaseOption"')) {
        bndCaseOption = dataResults.FlagCaseOption;
        console.log('***  arrayResponses-length: ' + arrayResponses.length);
        arrayResponses.forEach((resp: any) => {
          if (this.existInJSON(resp,'"flagOption"') && resp.flagOption) {
            strCase = resp.value;
          }
        });
      }
      console.warn('***  bndCaseOption: '+ bndCaseOption +', strCase: ' + strCase);
      let noCase = 0;
      let txtResult = '';
      let strValues = '';
      if (strCase) {
        caseCmpr = strCase;
      } else if (casesStr) {
        caseCmpr = casesStr;
      }
      let mLegend: any;
      if (noLegends > 0 && this.existInJSON(dataResults,'"Legends"') && dataResults.Legends) {
        console.warn({dataResults: dataResults});
        mLegend = dataResults.Legends;
      } else if (this.existInJSON(tableResults,'"Table"') && tableResults.Table) {
        console.warn({tableResults: tableResults});
        mLegend = tableResults.Table;
      }
      const results = this.getResultsFromCase(tableResults.Items,flgScore,score,caseCmpr);
      if (results) {
        noCase = results.case;
        txtResult = results.result;
        strValues = results.values;
      }
      console.log('***  txtResult: '+ txtResult +', strValues: '+ strValues);
      if (txtResult) {
        console.log('***  noLegends: '+ noLegends +', mLegend: ' + mLegend);
        console.warn('***  mLegend-length: ' + mLegend.length);
        if (txtResult && mLegend.includes('LEGEND') && mLegend.length == 6) {
          strResult = txtResult;
        } else if (mLegend) {
          console.log('***  mLegend: ' + mLegend);
          if (mLegend.includes('SCORE') && (score || score.toString() === '0')) {
            console.warn('***  score: ' + score);
            mLegend = mLegend.replace('SCORE',score);
          }
          if (mLegend.includes('CONTENT') && txtResult.includes('|')) {
            let arrarRowsLgnds: Array<any> = [];
            let arrayLegends = txtResult.split('|');
            arrayLegends.forEach(str => {
              arrarRowsLgnds.push(str);
            });
            console.warn('***  arrarRowsLgnds-length: ' + arrarRowsLgnds.length);
            let arrayHeaders: Array<any> = [];
            if (this.existInJSON(tableResults,'"Headers"') && tableResults.Headers.includes('|')) {
              let arryHeaders = tableResults.Headers.split('|');
              arryHeaders.forEach((strHeader: string) => {
                arrayHeaders.push(strHeader);
              });
              console.warn('***  arrayHeaders-length: ' + arrayHeaders.length);
            }
            let arrayTitles: Array<any> = [];
            if (this.existInJSON(tableResults,'"Titles"') && tableResults.Titles.includes('|')) {
              let arryTitles = tableResults.Titles.split('|');
              arryTitles.forEach((strTitle: string) => {
                arrayTitles.push(strTitle);
              });
              console.warn('***  arrayTitles-length: ' + arrayTitles.length);
            } else if (this.existInJSON(tableResults,'"Titles"')) {
              let arrayTitles = [tableResults.Titles];
              console.warn('***  arrayTitles-length: ' + arrayTitles.length);
            }
            let noOptnLgnd = -1;
            if (this.existInJSON(dataResults,'"OptionLegend"')) {
              let optnLegend = dataResults.OptionLegend;
              console.log('***  optnLegend: ' + optnLegend);
              arrayResponses.forEach((resp2: any) => {
                if (resp2.param == optnLegend) {
                  var strValue = '';
                  strValue += resp2.value;
                  console.log('***  strValue: ' + strValue);
                  if (strValue.includes('.')) {
                    noOptnLgnd = parseFloat(strValue);
                  } else {
                    noOptnLgnd = parseInt(strValue);
                  }
                }
              });
              console.log('***  noOptnLgnd: ' + noOptnLgnd);
            }
            if (noOptnLgnd >= 0 && mLegend) {
              if (mLegend.includes('|')) {
                let arryLegends = mLegend.split('|');
                mLegend = arryLegends[noOptnLgnd];
              }
            } else if (arrayHeaders.length > 0) {
              let countH = 0;
              arrayHeaders.forEach(header => {
                console.log('***  header: ' + header);
                countH++;
                if (mLegend.includes('HEADER')) {
                  let strHdr = 'HEADER'+countH;
                  mLegend = mLegend.replace(strHdr,header);
                }
              });
            }
            if (arrayTitles.length > 0) {
              console.log('***  noCase: ' + noCase);
              strTitle = (arrayTitles.length > 1 ? arrayTitles[noCase-1] : arrayTitles[0]);
              console.log('***  strTitle: ' + strTitle);
            }
            console.warn('***  mLegend: ' + mLegend);
            if (mLegend.includes('CONTENT')) {
              console.log({arrarRows: arrarRowsLgnds});
              if (arrarRowsLgnds.length > 0) {
                let countV = 0;
                arrarRowsLgnds.forEach(str => {
                  countV++;
                  let strVal = 'CONTENT'+countV;
                  mLegend = mLegend.replace(strVal,str);
                });
              } else {
                mLegend = mLegend.replace('CONTENT',strValues);
              }
            }
            strResult = mLegend;
            console.log('***  mStrResult: ' + strResult);
          } else if (mLegend.includes('CONTENT')) {
            strResult = mLegend.replace('CONTENT',txtResult);
          } else if (mLegend.includes('LEGEND')) {
            strResult = mLegend.replace('LEGEND',txtResult);
          } else {
            strResult = txtResult;
          }
          if (strResult.includes('TITLE')) {
            strResult = strResult.replace('TITLE',txtResult);
          }
          console.log('***  mStrResult: ' + strResult);
        }
      } else if (strValues) {
        let arrarRows: Array<string> = [];
        if (strValues.includes('|')) {
          let arrayValues = strValues.split('|');
          arrayValues.forEach(str => {
            arrarRows.push(str);
          });
          console.warn('***  arrarRows-length: ' + arrarRows.length);
        }
        let arrayHeaders: Array<string> = [];
        if (this.existInJSON(tableResults,'"Headers"') && tableResults.Headers.includes('|')) {
          let arryHeaders = tableResults.Headers.split('|');
          arryHeaders.forEach((strHeader: string) => {
            arrayHeaders.push(strHeader);
          });
          console.warn('***  arrayHeaders-length: ' + arrayHeaders.length);
        }
        let arrayTitles: Array<string> = [];
        if (this.existInJSON(tableResults,'"Titles"') && tableResults.Titles.includes('|')) {
          let arryTitles = tableResults.Titles.split('|');
          arryTitles.forEach((strTitle: string) => {
            arrayTitles.push(strTitle);
          });
          console.warn('***  arrayTitles-length: ' + arrayTitles.length);
        } else if (this.existInJSON(tableResults,'"Titles"')) {
          let arrayTitles = [tableResults.Titles];
          console.warn('***  arrayTitles-length: ' + arrayTitles.length);
        }
        console.log('***  noLegends: '+ noLegends +', mLegend: ' + mLegend);
        if (mLegend) {
          let noOptnLgnd = -1;
          if (this.existInJSON(dataResults,'"OptionLegend"')) {
            let optnLegend = dataResults.OptionLegend;
            console.log('***  optnLegend: ' + optnLegend);
            arrayResponses.forEach((resp2: any) => {
              if (resp2.param == optnLegend) {
                var strValue = '';
                strValue += resp2.value;
                console.log('***  strValue: ' + strValue);
                if (strValue.includes('.')) {
                  noOptnLgnd = parseFloat(strValue);
                } else {
                  noOptnLgnd = parseInt(strValue);
                }
              }
            });
            console.log('***  noOptnLgnd: ' + noOptnLgnd);
          }
          if (noOptnLgnd >= 0 && mLegend) {
            if (mLegend.includes('|')) {
              let arryLegends = mLegend.split('|');
              mLegend = arryLegends[noOptnLgnd];
            }
          } else if (arrayHeaders.length > 0) {
            let countH = 0;
            arrayHeaders.forEach(header => {
              console.log('***  header: ' + header);
              countH++;
              if (mLegend.includes('HEADER')) {
                let strHdr = 'HEADER'+countH;
                mLegend = mLegend.replace(strHdr,header);
              }
            });
          }
          if (arrayTitles.length > 0) {
            console.log('***  noCase: ' + noCase);
            strTitle = (arrayTitles.length > 1 ? arrayTitles[noCase-1] : arrayTitles[0]);
            console.log('***  strTitle: ' + strTitle);
          }
          console.warn('***  mLegend: ' + mLegend);
          if (mLegend.includes('SCORE') && (score || score.toString() === '0')) {
            console.warn('***  score: ' + score);
            mLegend = mLegend.replace('SCORE',score);
          } else if (mLegend.includes('VALUE')) {
            console.log({arrarRows: arrarRows});
            if (arrarRows.length > 0) {
              let countV = 0;
              arrarRows.forEach(str => {
                countV++;
                let strVal = 'VALUE'+countV;
                mLegend = mLegend.replace(strVal,str);
              });
            } else {
              mLegend = mLegend.replace('VALUE',strValues);
            }
          }
          strResult = mLegend;
          console.log('***  mStrResult: ' + strResult);
        } else {
          console.warn('***  TODO VALIDAR...');
        }
      }
    }
    if (strTitle) {
      return {
        title: strTitle,
        result: strResult,
        observation: strObservation
      };
    } else {
      return {
        result: strResult,
        observation: strObservation
      };
    }
    return {
      result: strResult,
      observation: strObservation
    };
  }

  getStrCase(currentReagent: any, currentResp: any) {
    let strCase: any;
    if (currentReagent && currentResp) {
      let strValue = currentResp.value + '';
      let valor: any;
      let arrayStrValues: Array<any> = [];
      let arrayValues: Array<any> = [];
      if (strValue.includes('|')) {
        arrayStrValues = strValue.split('|');
        arrayStrValues.forEach((str) => {
          if (this.validateStringIsNumber(str) && !str.includes('.')) {
            arrayValues.push(parseInt(str));
          }
        });
      } else if (this.validateStringIsNumber(strValue)) {
        valor = parseInt(strValue);
      }
      if (valor && !strValue.includes('.')) {
        console.warn('***  valor: ' + valor);
        currentReagent.Items.forEach((item: any) => {
          if (item.ItemId == valor) {
            strCase = item.Value;
          }
        });
      } else if (arrayValues.length > 0 && arrayValues[0]) {
        console.warn('***  arrayValues-length: ' + arrayValues.length);
        currentReagent.Items.forEach((item2: any) => {
          if (item2.ItemId == arrayValues[0]) {
            strCase = item2.Value;
          }
        });
      } else if (arrayStrValues.length > 0 && arrayStrValues[0]) {
        console.warn('***  arrayStrValues-length: ' + arrayStrValues.length);
        currentReagent.Items.forEach((item2: any) => {
          if (item2.Value == arrayStrValues[0]) {
            strCase = item2.Value;
          }
        });
      } else {
        console.warn('***  resp-value: ' + currentResp.value);
        strCase = currentResp.value;
      }
    }
    console.warn('***  strCase: ' + strCase);
    return strCase;
  }

  getValidations(reagent: any, strOptions: string) {
    let arryOptions = strOptions.split(':');
    let strOpc = '';
    if (arryOptions && arryOptions.length > 0) {
      strOpc = arryOptions[0];
    }
    console.log('***  strOpc: ' + strOpc);
    let leyendaValidation: any;
    if (this.existInJSON(reagent,'"LeyendaValidation"')) {
      leyendaValidation = reagent.LeyendaValidation;
    }
    let strSize: any;
    let valMinor: any;
    let valMinEqual: any;
    let valMajor: any;
    let valMaxEqual: any;
    switch (strOpc) {
      case 'MIN':
        let strMin = arryOptions[1].toString();
        console.log('***  strMin: ' + strMin);
        strSize = strMin.length;
        valMinor = (strMin.includes('.') ? parseFloat(strMin) : parseInt(strMin));
        console.log('***  valMinor: ' + valMinor);
        break;
      case 'MIN-EQUAL':
        let strMinEqual = arryOptions[1].toString();
        console.log('***  strMinEqual: ' + strMinEqual);
        strSize = 1;
        valMinEqual = (strMinEqual.includes('.') ? parseFloat(strMinEqual) : parseInt(strMinEqual));
        console.log('***  valMinEqual: ' + valMinEqual);
        break;
      case 'MAX':
        let strMax = arryOptions[1].toString();
        console.log('***  strMax: ' + strMax);
        strSize = strMax.length;
        valMajor = (strMax.includes('.') ? parseFloat(strMax) : parseInt(strMax));
        console.log('***  valMajor: ' + valMajor);
         break;
      case 'MAX-EQUAL':
        let strMaxEqual = arryOptions[1].toString();
        console.log('***  strMaxEqual: ' + strMaxEqual);
        strSize = strMaxEqual.length;
        valMaxEqual = (strMaxEqual.includes('.') ? parseFloat(strMaxEqual) : parseInt(strMaxEqual));
        console.log('***  valMaxEqual: ' + valMaxEqual);
         break;
      case 'RANGE':
        let strValidation = arryOptions[1].toString();
        console.log('***  strValidation-1: ' + strValidation);
        let strValdtn = strValidation.replace('[','');
        strValidation = strValdtn.replace(']','');
        console.log('***  strValidation2: ' + strValidation);
        let arryValidation = strValidation.split(',');
        console.log({validation: arryValidation});
        if (arryValidation && arryValidation.length > 0) {
          strSize = ((arryValidation[0].length < arryValidation[1].length) ? arryValidation[0].length : arryValidation[1].length);
          if (arryValidation[0].includes('.') || arryValidation[1].includes('.')) {
            valMinor = parseFloat(arryValidation[0]);
            valMajor = parseFloat(arryValidation[1]);
          } else {
            valMinor = parseInt(arryValidation[0]);
            valMajor = parseInt(arryValidation[1]);
          }
          console.log('***  valMinor: ' + valMinor);
          console.log('***  valMajor: ' + valMajor);
        }
        break;
      default:
        break;
    }
    return {
      leyenda: leyendaValidation,
      sizeStr: strSize,
      minor: valMinor,
      minEqual: valMinEqual,
      major: valMajor,
      maxEqual: valMaxEqual
    };
  }
  
  roundNumberIntl(number: number, decimals: any, useComma: boolean = false) {
    return this.utilities.roundNumberIntl(number,decimals,useComma);
  }

  updateArrayNext(arrayStrNext: string, strNext: string, separator: string = '|') {
    return this.utilities.updateArrayNext(arrayStrNext,strNext,separator);
  }

  validateItemScore(arrayResponses: Array<any>) {
    let itemScore = false;
    if (arrayResponses) {
      arrayResponses.forEach((itemResp) => {
        if (this.existInJSON(itemResp,'score')) {
          itemScore = true;
        }
      });
    }
    console.warn('***  itemScore: ' + itemScore);
    return itemScore;
  }

  validateScoreDecimal(arrayResponses: Array<any>) {
    let decimalScore = false;
    if (arrayResponses) {
      for(let indxR = 0; indxR < arrayResponses.length; indxR++) {
        const itemResp = arrayResponses[indxR];
        if (this.existInJSON(itemResp,'score')) {
          let strScore = itemResp.score+'';
          if (strScore.includes('.')) {
            decimalScore = true;
            break;
          }
        }
      }
    }
    console.warn('***  decimalScore: ' + decimalScore);
    return decimalScore;
  }

  validateScoreInteger(arrayResponses: Array<any>) {
    let intScore = false;
    if (arrayResponses) {
      for(let indxR = 0; indxR < arrayResponses.length; indxR++) {
        const itemResp = arrayResponses[indxR];
        if (this.existInJSON(itemResp,'score')) {
          let strScore = itemResp.score+'';
          if (this.validateStringIsNumber(strScore)) {
            intScore = true;
            break;
          }
        }
      }
    }
    console.warn('***  intScore: ' + intScore);
    return intScore;
  }

  validateStringIncludes(strCmpr: string, arrayIncludes: string[]) {
    return this.utilities.validateStringIncludes(strCmpr,arrayIncludes);
  }
  
  validateStringIsNumber(strValue: string) {
    return this.utilities.validateStringIsNumber(strValue);
  }
  
  validateResults(strResult: string, strHtmlResult: string) {
    return (strResult || strHtmlResult);
  }
}
