import { Injectable } from "@angular/core";
import { ProductInfo, KeyObject } from "../interfaces/favorites";
import { NativeStorage } from "@awesome-cordova-plugins/native-storage/ngx";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class FavouritesService {
  listFavoriteProducts = new BehaviorSubject<ProductInfo[]>([]);
  listProducts$ = this.listFavoriteProducts.asObservable();

  countryKey: string;
  private indexWorking: number;
  favorites: Array<KeyObject> = [];
  private DrugsByCountryObj: KeyObject = {
    countryKey: "Default",
  };

  constructor(private nativeStorage: NativeStorage) {}

  initService() {
    this.countryKey = environment.applicationInfo.countryKey;
    const promise = new Promise<void>((resolve) => {
      const getFavoriteItemResult = this.getFavoriteItem();
      getFavoriteItemResult.then(() => {
        const getIndexByCountryKeyResult = this.getIndexByCountryKey();
        getIndexByCountryKeyResult.then(() => {
          resolve();
        });
      });

      getFavoriteItemResult.catch((ex) => {
        this.printExceptionMessage("getFavoriteItem", JSON.stringify(ex)).then(
          () => {
            this.DrugsByCountryObj.countryKey = this.countryKey;
            this.DrugsByCountryObj.products = [];
            this.favorites.push(this.DrugsByCountryObj);
            const saveFavoriteItemResult = this.saveFavoriteItem();
            this.indexWorking = 0;
            saveFavoriteItemResult.then(() => {
              resolve();
            });
            saveFavoriteItemResult.catch((err: any) => {
              this.printExceptionMessage(
                "getFavoriteItem",
                JSON.stringify(err)
              );
              resolve();
            });
          }
        );
      });
    });
    return promise;
  }

  private getIndexByCountryKey() {
    const promise = new Promise<void>((resolve) => {
      if (this.favorites.length >= 2) {
        // tslint:disable-next-line:forin
        for (const i in this.favorites) {
          if (this.favorites[i].countryKey === this.countryKey) {
            this.indexWorking = Number(i);
          }
        }
        if (this.indexWorking >= 0) {
        } else {
          this.DrugsByCountryObj.countryKey = this.countryKey;
          this.DrugsByCountryObj.products = [];
          this.indexWorking = this.favorites.push(this.DrugsByCountryObj) - 1;
          const saveFavoriteItemResult = this.saveFavoriteItem();
          saveFavoriteItemResult.then(() => {
            console.log(
              "getIndexByCountryKey then --> saveFavoriteItem succesful"
            );
          });
          saveFavoriteItemResult.catch((ex) => {
            console.log("getIndexByCountryKey catch-->  saveFavoriteItem");
            this.printExceptionMessage("saveFavoriteItem", JSON.stringify(ex));
          });
        }
      } else {
        if (this.favorites[0].countryKey === this.countryKey) {
          this.indexWorking = 0;
        } else {
          this.DrugsByCountryObj.countryKey = this.countryKey;
          this.DrugsByCountryObj.products = [];
          this.indexWorking = this.favorites.push(this.DrugsByCountryObj) - 1;
          const saveFavoriteItemResult = this.saveFavoriteItem();
          saveFavoriteItemResult.then(() => {
            console.log(
              "getIndexByCountryKey then --> saveFavoriteItemResult succesful"
            );
          });
          saveFavoriteItemResult.catch((ex) => {
            console.log(
              "getIndexByCountryKey catch -->  saveFavoriteItemResult"
            );
            this.printExceptionMessage(
              "saveFavoriteItemResult",
              JSON.stringify(ex)
            );
          });
        }
      }
      resolve();
    });
    return promise;
  }

  private getFavoriteItem() {
    const promise = new Promise((resolve, reject) => {
      this.nativeStorage
        .getItem("favorites")
        .then((data) => {
          this.favorites = data;
          resolve(data);
        })
        .catch((ex) => {
          reject(ex);
        });
    });
    return promise;
  }

  private saveFavoriteItem() {
    const promise = new Promise<void>((resolve, reject) => {
      this.nativeStorage
        .setItem("favorites", this.favorites)
        .then(() => {
          this.listFavoriteProducts.next(
            this.favorites[this.indexWorking].products
          );
          resolve();
        })
        .catch((ex) => {
          reject(ex);
        });
    });
    return promise;
  }

  private printExceptionMessage(methodName: string, detail: string) {
    const promise = new Promise<void>((resolve) => {
      const firstMessage = `${methodName} method failed`;
      const detailMessageExeption = `${methodName} Detail Exception: ${detail}`;
      console.log(firstMessage);
      console.log(detailMessageExeption);
      resolve();
    });
    return promise;
  }

  // tslint:disable-next-line:max-line-length
  addProduct(
    categoryId: number,
    categoryName: string,
    divisionId: number,
    divisionName: string,
    productId: number,
    brand: string,
    pharmaFormId: number,
    pharmaFormName: string,
    countryCode?: string
  ) {
    const product: ProductInfo = {
      brand: "",
      categoryId: 0,
      categoryName: "",
      divisionId: 0,
      divisionName: "",
      productId: 0,
      pharmaFormId: 0,
      pharmaFormName: "",
    };
    const promise = new Promise((resolve, reject) => {
      if (
        categoryId > 0 &&
        divisionId > 0 &&
        productId > 0 &&
        pharmaFormId > 0
      ) {
        product.brand = brand;
        product.categoryId = categoryId;
        product.categoryName = categoryName;
        product.divisionId = divisionId;
        product.divisionName = divisionName;
        product.pharmaFormId = pharmaFormId;
        product.pharmaFormName = pharmaFormName;
        product.productId = productId;
        if (countryCode) {
          product.countryCode = countryCode;
        }
        if (this.favorites[this.indexWorking].products.length >= 1) {
          const elements = this.favorites[this.indexWorking].products;
          let found = false;
          elements.forEach((element) => {
            // tslint:disable-next-line:max-line-length
            if (
              product.categoryId === element.categoryId &&
              product.divisionId === element.divisionId &&
              product.pharmaFormId === element.pharmaFormId &&
              product.productId === element.productId
            ) {
              console.warn(
                "Se encontro en el arreglo el Producto por lo tanto no deberia de agregarse a la lista"
              );
              found = true;
            }
          });

          if (!found) {
            this.favorites[this.indexWorking].products.push(product);
            const saveFavoriteItemResult = this.saveFavoriteItem();
            saveFavoriteItemResult.then(() => {
              resolve(this.favorites);
            });
            saveFavoriteItemResult.catch((ex) => {
              console.warn(JSON.stringify(ex));
              reject();
            });
          } else {
            const ex = "ya existe el producto";
            reject(ex);
          }
        } else {
          this.favorites[this.indexWorking].products.push(product);
          const saveFavoriteItemResult = this.saveFavoriteItem();
          saveFavoriteItemResult.then(() => {
            resolve(this.favorites);
          });
          saveFavoriteItemResult.catch((ex) => {
            console.warn(JSON.stringify(ex));
            reject();
          });
        }
      } else {
        reject();
      }
    });
    return promise;
  }

  getListProduct() {
    this.listFavoriteProducts.next(this.favorites[this.indexWorking].products);
    return this.favorites[this.indexWorking].products;
  }

  removeAllProduct() {
    const promise = new Promise((resolve, reject) => {
      if (this.favorites[this.indexWorking].products.length >= 1) {
        this.favorites[this.indexWorking].products = [];
        const saveFavoriteItemResult = this.saveFavoriteItem();
        saveFavoriteItemResult.then(() => {
          resolve(this.favorites[this.indexWorking].products);
        });
        saveFavoriteItemResult.catch((ex) => {
          this.printExceptionMessage(
            "saveFavoriteItem",
            JSON.stringify(ex)
          ).then(() => {
            reject(ex);
          });
        });
      } else {
        resolve(this.favorites[this.indexWorking].products);
      }
    });
    return promise;
  }

  // tslint:disable-next-line:max-line-length
  removeProduct(
    categoryId: number,
    categoryName: string,
    divisionId: number,
    divisionName: string,
    productId: number,
    brand: string,
    pharmaFormId: number,
    pharmaFormName: string,
    countryCode?: string
  ) {
    const product: ProductInfo = {
      brand: "",
      categoryId: 0,
      categoryName: "",
      divisionId: 0,
      divisionName: "",
      productId: 0,
      pharmaFormId: 0,
      pharmaFormName: "",
    };
    const newPoducts: Array<ProductInfo> = [];
    const promise = new Promise((resolve, reject) => {
      if (
        categoryId > 0 &&
        divisionId > 0 &&
        productId > 0 &&
        pharmaFormId > 0
      ) {
        product.brand = brand;
        product.categoryId = categoryId;
        product.categoryName = categoryName;
        product.divisionId = divisionId;
        product.divisionName = divisionName;
        product.pharmaFormId = pharmaFormId;
        product.pharmaFormName = pharmaFormName;
        product.productId = productId;
        if (countryCode) {
          product.countryCode = countryCode;
        }

        if (this.favorites[this.indexWorking].products.length >= 1) {
          const elements = this.favorites[this.indexWorking].products;
          elements.forEach((element) => {
            // tslint:disable-next-line:max-line-length
            if (
              !(
                product.categoryId === element.categoryId &&
                product.divisionId === element.divisionId &&
                product.pharmaFormId === element.pharmaFormId &&
                product.productId === element.productId
              )
            ) {
              newPoducts.push(element);
            }
          });
          if (
            this.favorites[this.indexWorking].products.length !==
            newPoducts.length
          ) {
            this.favorites[this.indexWorking].products = newPoducts;
            const saveFavoriteItemResult = this.saveFavoriteItem();
            saveFavoriteItemResult.then(() => {
              resolve(this.favorites[this.indexWorking].products);
            });
            saveFavoriteItemResult.catch((ex) => {
              reject(ex);
            });
          } else {
            resolve(this.favorites[this.indexWorking].products);
          }
        } else {
          const ex = "No existen productos";
          this.printExceptionMessage("removeProduct", JSON.stringify(ex)).then(
            () => {
              reject(ex);
            }
          );
        }
      } else {
        const ex = `Identificadores no validos:  ${categoryId} ${divisionId} ${productId} ${pharmaFormId}`;
        reject(ex);
      }
    });
    return promise;
  }

  // tslint:disable-next-line:max-line-length
  checkProduct(
    categoryId: number,
    categoryName: string,
    divisionId: number,
    divisionName: string,
    productId: number,
    brand: string,
    pharmaFormId: number,
    pharmaFormName: string,
    countryCode?: string
  ) {
    let found = false;
    const product: ProductInfo = {
      brand: "",
      categoryId: 0,
      categoryName: "",
      divisionId: 0,
      divisionName: "",
      productId: 0,
      pharmaFormId: 0,
      pharmaFormName: "",
    };
    product.brand = brand;
    product.categoryId = categoryId;
    product.categoryName = categoryName;
    product.divisionId = divisionId;
    product.divisionName = divisionName;
    product.pharmaFormId = pharmaFormId;
    product.pharmaFormName = pharmaFormName;
    product.productId = productId;
    if (countryCode) {
      product.countryCode = countryCode;
    }
    if (this.favorites[this.indexWorking].products.length >= 1) {
      const elements = this.favorites[this.indexWorking].products;
      elements.forEach((element) => {
        if (
          product.categoryId === element.categoryId &&
          product.divisionId === element.divisionId &&
          product.pharmaFormId === element.pharmaFormId &&
          product.productId === element.productId
        ) {
          found = true;
        }
      });
    }
    return found;
  }
}
