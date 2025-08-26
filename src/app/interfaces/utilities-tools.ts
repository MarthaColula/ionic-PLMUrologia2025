
import { ElectronicInformationContent } from "../interfaces/content";

export class UtilitiesTools {

  public arrayElementsHTML = ['</p>', '</ion-', '<img' ];

  concatenateStrings(arraryStrings: any, strSeparator: string) {
      let strValues: any;
      if (arraryStrings && arraryStrings.length > 0) {
          strValues = '';
          arraryStrings.forEach((str: string) => {
              if (strValues != '') {
                  strValues += strSeparator +' '+ str;
              } else {
                  strValues = str;
              }
          });
      }
      return strValues;
  }
  
  existContentInArray(arrayData: Array<ElectronicInformationContent>, content: ElectronicInformationContent) {
    let exists = false;
    for(let indxC = 0; indxC < arrayData.length; indxC++) {
      const cmpCal = arrayData[indxC];
      if (cmpCal.ElectronicTitle === content.ElectronicTitle) {
        exists = true;
        break;
      }
    }
    return exists;
  }
  
  existInJSON(jsonOBJ: any, strTag: string) {
    if (jsonOBJ && JSON.stringify(jsonOBJ).toString().includes(strTag)) {
      return true;
    } else {
      return false;
    }
  }

  getArrayFromString(srtArray: string, separator: string) {
    let newArray = srtArray.split(separator);
    if (newArray.length > 0) {
      return newArray;
    } else {
      return [];
    }
  }
  
  roundNumberIntl(number: number, decimals: any, useComma: boolean = false) {
    if (number) {
      let opciones = {
        maximumFractionDigits: decimals, 
        useGrouping: false
      };
      let str = useComma ? "es" : "en";
      return new Intl.NumberFormat(str, opciones).format(number);
    } else {
      return parseInt(number.toString());
    }
  }
  
  updateArrayNext(arrayStrNext: string, strNext: string, separator: string = '|') {
    if (strNext) {
      if (arrayStrNext) {
        if (!arrayStrNext.includes(strNext)) {
          arrayStrNext += separator + strNext;
        }
      } else {
        arrayStrNext = strNext;
      }
    }
    return arrayStrNext;
  }
  
  validateStringIncludes(strCmpr: string, arrayIncludes: string[]) {
    let strIncludes = false;
    if (strCmpr && arrayIncludes && arrayIncludes.length > 0) {
      for(let indxIncld = 0; indxIncld < arrayIncludes.length; indxIncld++) {
        const strIncl = arrayIncludes[indxIncld];
        if (strCmpr.includes(strIncl)) {
          strIncludes = true;
          break;
        }
      }
    }
    return strIncludes;
  }
  
  validateStringIsNumber(strValue: string) {
    if (strValue) {
      const regex = /^[0-9]*$/;
      return regex.test(strValue);
    } else {
      return false;
    }
  }
}
