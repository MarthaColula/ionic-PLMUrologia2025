import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpFetchService {
  private dataSerializer: string = 'json';

  /**
   * Establece el serializador de datos
   * @param serializer - 'json', 'urlencoded', 'utf8', 'multipart', 'raw'
   */
  setDataSerializer(serializer: string): void {
    this.dataSerializer = serializer;
  }

  /**
   * Realiza una petición GET
   */
  async get(url: string, params: any = {}, headers: any = {}): Promise<any> {
    // Añadir los parámetros a la URL
    const urlWithParams = this.appendQueryParams(url, params);
    
    try {
      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: this.prepareHeaders(headers)
      });
      
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Realiza una petición POST
   */
  async post(url: string, body: any = {}, headers: any = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: this.serializeData(body),
        headers: this.prepareHeaders(headers)
      });
      
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put(url: string, body: any = {}, headers: any = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: this.serializeData(body),
        headers: this.prepareHeaders(headers)
      });
      
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete(url: string, params: any = {}, headers: any = {}): Promise<any> {
    // Añadir los parámetros a la URL
    const urlWithParams = this.appendQueryParams(url, params);
    
    try {
      const response = await fetch(urlWithParams, {
        method: 'DELETE',
        headers: this.prepareHeaders(headers)
      });
      
      return this.formatResponse(response);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Añade los parámetros de consulta a la URL
   */
  private appendQueryParams(url: string, params: any): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }
    
    const queryString = Object.keys(params)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
      
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + queryString;
  }

  /**
   * Formatea la respuesta para mantener compatibilidad con el formato de Cordova HTTP
   */
  private async formatResponse(response: Response): Promise<any> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    // Intentar leer los datos como texto primero, ya que puede ser cualquier formato
    const text = await response.text();
    let data = text;
    
    // Intentar parsear como JSON si es posible
    try {
      if (text && (text.startsWith('{') || text.startsWith('['))) {
        data = JSON.parse(text);
      }
    } catch (e) {
      // Si no es JSON, dejar como texto
    }
    
    return {
      status: response.status,
      headers: headers,
      data: data,
      url: response.url
    };
  }

  /**
   * Formatea el error para mantener compatibilidad
   */
  private formatError(error: any): any {
    return {
      status: -1,
      error: error.message || 'Unknown error',
      headers: {},
      url: ''
    };
  }

  /**
   * Prepara los headers según el tipo de serialización
   */
  private prepareHeaders(headers: any): Headers {
    const result = new Headers(headers);
    
    if (this.dataSerializer === 'json' && !headers['Content-Type']) {
      result.set('Content-Type', 'application/json');
    } else if (this.dataSerializer === 'urlencoded' && !headers['Content-Type']) {
      result.set('Content-Type', 'application/x-www-form-urlencoded');
    }
    
    return result;
  }

  /**
   * Serializa los datos según el formato configurado
   */
  private serializeData(data: any): string | FormData | null {
    if (!data) return null;
    
    switch (this.dataSerializer) {
      case 'json':
        return JSON.stringify(data);
      case 'urlencoded':
        if (typeof data === 'object') {
          return Object.keys(data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');
        }
        return String(data);
      case 'multipart':
        const formData = new FormData();
        if (typeof data === 'object') {
          Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
          });
        }
        return formData;
      default:
        return String(data);
    }
  }
}