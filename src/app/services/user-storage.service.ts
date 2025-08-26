import { Injectable } from '@angular/core';
import { INSUserInfo } from '../interfaces/nativeStorage';
import { Preferences } from '@capacitor/preferences';
//import { Plugins } from '@capacitor/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { GlobalvarsService } from './globalvars.service';

//const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private readonly STORAGE_KEY = 'userInfo';

  userInfo: INSUserInfo = {
    email: '',
    codeString: '',
    prefijo: '',
    clientID : 0
  };

  public contactKeyValidation: any = false;
  public contactKey: any = '';

  constructor(
    private nativeStorage: NativeStorage,
    private globalVarsService: GlobalvarsService,
  ) {}

  async updateUserInfo(updatedFields: any): Promise<any | null> {
    console.log('userStorageService - updateUserInfo', updatedFields);
    try {
      // Obtener los datos actuales del usuario
      const currentUserInfo = await this.getUserInfo();
      if (!currentUserInfo) {
        console.warn('No se encontraron datos existentes del usuario. Se guardarán los nuevos datos.');
        // Si no hay datos existentes, guarda directamente los nuevos datos
        await this.saveUserInfo(updatedFields);
        return updatedFields;
      }
  
      // Función recursiva para fusionar objetos y actualizar solo campos coincidentes
      const mergeMatchingFields = (current: any, updates: any): any => {
        const merged = { ...current };
      Object.keys(updates).forEach((key) => {
        if (
          typeof updates[key] === 'object' &&
          updates[key] !== null &&
          !Array.isArray(updates[key]) &&
          typeof current[key] === 'object'
        ) {
          // Si es un objeto anidado, realizar una fusión recursiva
          merged[key] = mergeMatchingFields(current[key] || {}, updates[key]);
        } else {
          // Agregar o actualizar el campo
          merged[key] = updates[key];
        }
      });
      return merged;
      };
  
      // Fusionar los datos actuales con los campos actualizados
      const mergedUserInfo = mergeMatchingFields(currentUserInfo, updatedFields);
  
      // Guardar los datos actualizados
      await this.saveUserInfo(mergedUserInfo);
      console.log('Información del usuario actualizada correctamente.', mergedUserInfo);
      return mergedUserInfo;
    } catch (error) {
      console.error('Error actualizando la información del usuario:', error);
      throw error;
    }
  }

  /**
   * Save user info to preferences
   */
  async saveUserInfo(userInfo: INSUserInfo): Promise<void> {
    console.log('userStorageService - saveUserInfo', userInfo);
    try {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(userInfo)
      });
      this.globalVarsService.setClientInfo(userInfo);
      console.log('Se guardo correctamente la información en Preference');
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  }

    /**
   * Get user info from preferences
   */
    async getUserInfo(): Promise<INSUserInfo | null> {
      console.log('userStorageService - gerUserInfo')
      try {
        const result = await Preferences.get({ key: this.STORAGE_KEY });
        console.log('userStorageService - gerUserInfo - result', result);
        if (result.value) {
          console.log('userStorageService - gerUserInfo - result - value', result.value);
          return JSON.parse(result.value) as INSUserInfo;
        }
        return null;
      } catch (error) {
        console.error('Error retrieving user info:', error);
        throw error;
      }
    }

    async migrateFromNativeStorage() {
      try {
        // Read old data using Preferences
        const oldData = await Preferences.get({ key: 'userInfo' });
        console.log('Migration failed:===============> ', oldData);
        if (oldData.value) {
          // Store it using the new method
          await Preferences.set({
            key: 'yourNewKey',
            value: oldData.value
          });
        }
      } catch (error) {
        console.error('Migration failed:', error);
      }
    }

    async loadUserInfo() {
      try {
        const data = await this.nativeStorage.getItem('userInfo'); 
        console.warn('loadUserInfo', data);       
        if (!data) {
          console.warn('NativeStorageService', 'No se encontraron datosl usuario');
          return null;
        }
        console.warn('NativeStorageService', 'Todo Correcto loadUserInfo');
        console.warn('NativeStorageService', JSON.stringify(data));
    
        this.userInfo.email = data.email;
        this.userInfo.codeString = data.codeString;
    
        if (data.prefijo){
          this.userInfo.prefijo = data.prefijo;
        } 
        if (data.clientID){
          this.userInfo.clientID = data.clientID;
        } 
        if (data.profession){
          this.userInfo.profession = data.profession;
        }
        if (data.speciality){
          this.userInfo.speciality = data.speciality;
        } 
        console.warn('NativeStorageService', data);
        this.globalVarsService.setClientInfo(this.userInfo);
        console.log('loadUSerInfo - userInfo', this.userInfo);
        return data;
      } catch (error) {
        console.warn('NativeStorageService', 'Ha ocurrido un error en loadUserInfo');
        console.warn('NativeStorageService', error);
        return null;
      }
    }

  /**
   * Clear user info from preferences
   */
  /*async clearUserInfo(): Promise<void> {
    try {
      await Preferences.remove({ key: this.STORAGE_KEY });
      this.userInfo = {
        email: '',
        codeString: '',
        prefijo: '',
        clientID: 0
      };
    } catch (error) {
      console.error('Error clearing user info:', error);
      throw error;
    }
  }*/

}
