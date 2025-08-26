import { ProductInfo } from '../interfaces/interaction';
import { KeyObject } from '../interfaces/interaction';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  // Varibles
  // tslint:disable-next-line:variable-name
  _countryKey: string;
  indexWorking: number;

  private interactions: any | Array<KeyObject> = [];

  DrugsByCountryObj: KeyObject = {
    countryKey: 'Default'
  };
  // end Varibles

  constructor(
    private nativeStorage: NativeStorage
  ) {
    console.warn('Iniciando Interactions Service');
    const index = 0;
    // Test random para seleccionar un pais al azar
    // let index = Math.floor(Math.random()* 7) + 0;
    console.warn(index);
    this._countryKey = environment.applicationInfo.countryKey;
    console.warn(this._countryKey);
    /**/
  }

  initService() {

    const promise = new Promise<void>((resolve) => {
      console.warn('InitService - CountryKey', environment.applicationInfo.countryKey);

      const getInteractionItemResult = this.getInteractionItem();
      console.log('InitService - getInteractionItemResult', getInteractionItemResult);

      getInteractionItemResult.then(() => {
        console.warn('getInteractionItem succesful');
        console.warn(this.interactions.length);
        const getIndexByCountryKeyResult = this.getIndexByCountryKey();
        getIndexByCountryKeyResult.then(() => {
          console.warn('getIndexByCountryKey succesful');
          console.warn(JSON.stringify(this.interactions));
          resolve();
        });
      });

      getInteractionItemResult.catch(ex => {
        this.printExceptionMessage('getInteractionItem', JSON.stringify(ex)).then(() => {
          console.warn('No existe ningun Registro de Interactions.');
          console.warn('Se procedera a crear uno por defecto usando el global countryKey');

          this.DrugsByCountryObj.countryKey = this._countryKey;
          this.DrugsByCountryObj.products = [];

          this.interactions.push(this.DrugsByCountryObj);

          const saveInteractionItemResult = this.saveInteractionItem();

          this.indexWorking = 0;

          saveInteractionItemResult.then(() => {
            console.warn('saveInteractionItem succesful');

            console.warn('IndexWorking value is: ' + this.indexWorking);

            console.warn(JSON.stringify(this.interactions));
            resolve();
          });

          // tslint:disable-next-line:no-shadowed-variable
          saveInteractionItemResult.catch(ex => {
            console.warn('getInteractionItemResult -->  saveInteractionItem');
            this.printExceptionMessage('getInteractionItem', JSON.stringify(ex));

            resolve();
          });
        });

      });

    });

    return promise;
  }

  private getIndexByCountryKey() {
    const promise = new Promise<void>((resolve) => {

      if (this.interactions.length >= 2) {
        console.warn('Existen 2 o más  Objetos donde se pueden cargar datos');
        // tslint:disable-next-line:forin
        for (const i in this.interactions) {
          console.warn('el valor de i es: ' + i);
          console.warn(this.interactions[i].countryKey);

          if (this.interactions[i].countryKey === this._countryKey) {
            console.warn('Se encontro el pais ' + this._countryKey);
            this.indexWorking = Number(i);
          }
        }

        if (this.indexWorking >= 0) {
          console.warn('parece ser que si esta asignado');
          console.warn('El valor de indexWorking es : ' + this.indexWorking);
        } else {
          console.warn('Parece que no esta asignado');

          this.DrugsByCountryObj.countryKey = this._countryKey;
          this.DrugsByCountryObj.products = [];

          this.indexWorking = (this.interactions.push(this.DrugsByCountryObj) - 1);

          const saveInteractionItemResult = this.saveInteractionItem();

          console.warn('El valor de indexWorking es : ' + this.indexWorking);

          saveInteractionItemResult.then(() => {
            console.warn('getIndexByCountryKey then --> saveInteractionItem succesful');
          });
          saveInteractionItemResult.catch(ex => {
            console.warn('getIndexByCountryKey catch-->  saveInteractionItem');
            this.printExceptionMessage('getInteractionItem', JSON.stringify(ex));
          });

        }

      } else {
        console.warn('la longitud de interaction es menor a 2');

        if (this.interactions[0].countryKey === this._countryKey) {
          this.indexWorking = 0;
        } else {
          console.warn('agregamos el pais porque es diferente al de la posicion 0');

          this.DrugsByCountryObj.countryKey = this._countryKey;
          this.DrugsByCountryObj.products = [];

          this.indexWorking = (this.interactions.push(this.DrugsByCountryObj) - 1);

          console.warn(this.indexWorking);

          const saveInteractionItemResult = this.saveInteractionItem();

          saveInteractionItemResult.then(() => {
            console.warn('getIndexByCountryKey then --> saveInteractionItem succesful');
          });

          saveInteractionItemResult.catch(ex => {
            console.warn('getIndexByCountryKey catch-->  saveInteractionItem');
            this.printExceptionMessage('getInteractionItem', JSON.stringify(ex));
          });

        }
        console.warn(this.interactions[this.indexWorking].countryKey);
      }

      resolve();
    });
    return promise;
  }

  private getInteractionItem() {
    console.log('getInteractionItem')
    const promise = new Promise((resolve, reject) => {
      this.nativeStorage.getItem('interactions')
        .then(data => {
          console.log('getInteractionItem - data', data);
          this.interactions = data;
          resolve(data);
        }).catch(ex => {
          console.log('getInteractionItem - error', ex);
          reject(ex);
        });
    });
    return promise;
  }

  private saveInteractionItem() {
    const promise = new Promise<void>((resolve, reject) => {
      this.nativeStorage.setItem('interactions', this.interactions)
        .then(() => {
          console.warn('Store interactions');
          resolve();
        })
        .catch(ex => {
          reject(ex);
        });
    });
    return promise;
  }

  private printExceptionMessage(methodName: string, detail: string) {

    const promise = new Promise<void>((resolve) => {

      const firstMessage = `${methodName} method failed`;
      const detailMessageExeption = `${methodName} Detail Exception: ${detail}`;

      console.warn(firstMessage);
      console.warn(detailMessageExeption);

      resolve();
    });

    return promise;
  }

  // tslint:disable-next-line:max-line-length
  addProduct(categoryId: number, categoryName: string, divisionId: number, divisionName: string, productId: number, brand: string, pharmaFormId: number, pharmaFormName: string, countryCode?: string) {

    const product: ProductInfo = {
      Brand: '',
      CategotyId: 0,
      CategoryName: '',
      DivisionId: 0,
      DivisionName: '',
      ProductId: 0,
      PharmaFormId: 0,
      PharmaForm: ''
    };

    const promise = new Promise((resolve, reject) => {

      if (categoryId > 0 && divisionId > 0 && productId > 0 && pharmaFormId > 0) {
        product.Brand = brand;
        product.CategotyId = categoryId;
        product.CategoryName = categoryName;
        product.DivisionId = divisionId;
        product.DivisionName = divisionName;
        product.PharmaFormId = pharmaFormId;
        product.PharmaForm = pharmaFormName;
        product.ProductId = productId;

        if (countryCode) {
          product.CountryCode = countryCode;
        }

        if (this.interactions[this.indexWorking].products.length >= 1) {
          const elements: any = this.interactions[this.indexWorking].products;
          let found = false;

          elements.forEach((element: any) => {

            console.warn(JSON.stringify(element));

            // tslint:disable-next-line:max-line-length
            if (product.CategotyId === element.CategotyId && product.DivisionId === element.DivisionId && product.PharmaFormId === element.PharmaFormId && product.ProductId === element.ProductId) {
              console.warn('Se encontro en el arreglo el Producto por lo tanto no deberia de agregarse a la lista');
              found = true;
            }
          });

          if (!found) {
            console.warn('No se encontraron  el producto en la lista de productos: ' + found);

            this.interactions[this.indexWorking].products.push(product);

            console.warn(JSON.stringify(this.interactions[this.indexWorking].products));

            console.warn('Se inserto un producto ');

            const saveInteractionItemResult = this.saveInteractionItem();

            saveInteractionItemResult.then(() => {
              console.warn('saveInteractionItem SuccessFull');
              resolve(this.interactions);
            });

            saveInteractionItemResult.catch(ex => {
              console.warn(JSON.stringify(ex));
              reject();
            });
          } else {
            const ex = 'ya existe el producto';
            reject(ex);
          }
        } else {
          console.warn('Se inserto un producto ya que no existe ningun registro con el cual comparar');

          this.interactions[this.indexWorking].products.push(product);

          console.warn(JSON.stringify(this.interactions[this.indexWorking].products));

          const saveInteractionItemResult = this.saveInteractionItem();

          saveInteractionItemResult.then(() => {
            console.warn('saveInteractionItem SuccessFull');
            resolve(this.interactions);
          });

          saveInteractionItemResult.catch(ex => {
            console.warn(JSON.stringify(ex));
            reject();
          });
        }
      } else {
        console.warn('Algunos de los identificadores no tienen un valor valido');
        reject();
      }

    });

    return promise;
  }

  getListProduct() {
    return this.interactions[this.indexWorking].products;
  }

  removeAllProduct() {

    const promise = new Promise((resolve, reject) => {

      if (this.interactions[this.indexWorking].products.length >= 1) {
        this.interactions[this.indexWorking].products = [];

        const saveInteractionItemResult = this.saveInteractionItem();
        saveInteractionItemResult.then(() => {
          console.warn(JSON.stringify(this.interactions));
          resolve(this.interactions[this.indexWorking].products);
        });
        saveInteractionItemResult.catch(ex => {
          this.printExceptionMessage('saveInteractionItem', JSON.stringify(ex))
            .then(() => {
              reject(ex);
            });
        });
      } else {
        console.warn('No existen Productos que eliminar');
        resolve(this.interactions[this.indexWorking].products);
      }

    });

    return promise;

  }

  // tslint:disable-next-line:max-line-length
  removeProduct(categoryId: number, categoryName: string, divisionId: number, divisionName: string, productId: number, brand: string, pharmaFormId: number, pharmaFormName: string, countryCode?: string) {

    const product: ProductInfo = {
      Brand: '',
      CategotyId: 0,
      CategoryName: '',
      DivisionId: 0,
      DivisionName: '',
      ProductId: 0,
      PharmaFormId: 0,
      PharmaForm: ''
    };

    const newPoducts: Array<ProductInfo> = [];

    const promise = new Promise((resolve, reject) => {

      if (categoryId > 0 && divisionId > 0 && productId > 0 && pharmaFormId > 0) {
        product.Brand = brand;
        product.CategotyId = categoryId;
        product.CategoryName = categoryName;
        product.DivisionId = divisionId;
        product.DivisionName = divisionName;
        product.PharmaFormId = pharmaFormId;
        product.PharmaForm = pharmaFormName;
        product.ProductId = productId;

        if (countryCode) {
          product.CountryCode = countryCode;
        }

        if (this.interactions[this.indexWorking].products.length >= 1) {
          const elements: any = this.interactions[this.indexWorking].products;

          elements.forEach((element: any) => {
            console.warn(JSON.stringify(element));

            // tslint:disable-next-line:max-line-length
            if (!(product.CategotyId === element.CategotyId && product.DivisionId === element.DivisionId && product.PharmaFormId === element.PharmaFormId && product.ProductId === element.ProductId)) {
              newPoducts.push(element);
            }
          });

          if (this.interactions[this.indexWorking].products.length !== newPoducts.length) {
            console.warn(JSON.stringify(this.interactions));

            this.interactions[this.indexWorking].products = newPoducts;

            const saveInteractionItemResult = this.saveInteractionItem();

            saveInteractionItemResult.then(() => {
              console.warn('saveInteractionItem SuccessFull');
              resolve(this.interactions[this.indexWorking].products);
            });
            saveInteractionItemResult.catch(ex => {
              console.warn(JSON.stringify(ex));
              reject(ex);
            });
          } else {
            console.warn('No se elimino ningun producto');
            resolve(this.interactions[this.indexWorking].products);
          }
        } else {
          const ex = 'No existen productos';
          this.printExceptionMessage('removeProduct', JSON.stringify(ex)).then(() => {
            reject(ex);
          });
        }
      } else {
        reject();
      }

    });

    return promise;
  }

  // tslint:disable-next-line:max-line-length
  checkProduct(categoryId: number, categoryName: string, divisionId: number, divisionName: string, productId: number, brand: string, pharmaFormId: number, pharmaFormName: string, countryCode?: string) {

    let found = false;

    const product: ProductInfo = {
      Brand: '',
      CategotyId: 0,
      CategoryName: '',
      DivisionId: 0,
      DivisionName: '',
      ProductId: 0,
      PharmaFormId: 0,
      PharmaForm: ''
    };

    product.Brand = brand;
    product.CategotyId = categoryId;
    product.CategoryName = categoryName;
    product.DivisionId = divisionId;
    product.DivisionName = divisionName;
    product.PharmaFormId = pharmaFormId;
    product.PharmaForm = pharmaFormName;
    product.ProductId = productId;

    if (countryCode) {
      product.CountryCode = countryCode;
    }

    if (this.interactions[this.indexWorking].products.length >= 1) {
      const elements: any = this.interactions[this.indexWorking].products;
      elements.forEach((element: any) => {
        if (product.CategotyId === element.CategotyId
          && product.DivisionId === element.DivisionId
          && product.PharmaFormId === element.PharmaFormId
          && product.ProductId === element.ProductId) {
          found = true;
        }
      });
    }
    return found;
  }

}
