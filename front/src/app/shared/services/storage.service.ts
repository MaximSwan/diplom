import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {
  constructor() {}

  private readonly prefix = "mb";

  get length(): number {
    return localStorage.length;
  }

  key(index: number): string | null {
    return localStorage.key(index);
  }

  clear(): void {
    localStorage.clear();
  }

  setItem(key: string, value: any): void {
    const fullKey = this.makeKey(key);
    const strValue = this.stringify(value);

    localStorage.setItem(fullKey, strValue);
  }

  getItem(key: string): any {
    const fullKey = this.makeKey(key);
    const value = localStorage.getItem(fullKey);

    return value ? this.parse(value) : null;
  }

  removeItem(keys: string | Array<string>): void {
    if (Array.isArray(keys)) {
      keys.forEach((key) => localStorage.removeItem(this.makeKey(key)));
    } else {
      localStorage.removeItem(this.makeKey(keys));
    }
  }

  private stringify(value: any): string {
    let stringValue: string;

    if (!value) {
      stringValue = "";
    } else if (typeof value === "string") {
      stringValue = value;
    } else {
      stringValue = JSON.stringify(value);
    }

    return stringValue;
  }

  private parse(value: string): any {
    let outputValue: any;

    try {
      outputValue = JSON.parse(value);
    } catch (error) {
      outputValue = value;
    }

    return outputValue || null;
  }

  private makeKey(key: string): string {
    return Boolean(this.prefix) ? `${this.prefix}:${key}` : key;
  }
}
