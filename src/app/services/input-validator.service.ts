import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputValidatorService {

  sanitizeString(input: string): string {
    if (!input) return '';
    return input
      .replace(/[<>\"'&]/g, '')
      .trim()
      .substring(0, 1000);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  validateCodeString(code: string): boolean {
    if (!code) return false;
    return /^[a-zA-Z0-9]{20,50}$/.test(code);
  }

  sanitizeUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') return null;
      return urlObj.toString();
    } catch {
      return null;
    }
  }

  validateNumericId(id: any): number | null {
    const num = parseInt(id);
    return (isNaN(num) || num < 0) ? null : num;
  }
}