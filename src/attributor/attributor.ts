import Scope from '../scope';

export interface AttributorOptions {
  scope?: Scope;
  whitelist?: string[];
  default?: string;
}

export default class Attributor {
  public static keys(node: HTMLElement): string[] {
    return Array.from(node.attributes).map((item: Attr) => item.name);
  }

  public attrName: string;
  public keyName: string;
  public scope: Scope;
  public whitelist: string[] | undefined;
  public default: string | undefined;

  constructor(
    attrName: string,
    keyName: string,
    options: AttributorOptions = {},
  ) {
    this.attrName = attrName;
    this.keyName = keyName;
    const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
    this.scope =
      options.scope != null
        ? // Ignore type bits, force attribute bit
          (options.scope & Scope.LEVEL) | attributeBit
        : Scope.ATTRIBUTE;
    if (options.whitelist != null) {
      this.whitelist = options.whitelist;
    }
    if (options.default != null) { 
      this.default = options.default;
    }
  }

  public add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) {
      return false;
    }
    node.setAttribute(this.keyName, value);
    return true;
  }

  public canAdd(_node: HTMLElement, value: any): boolean {
    if (this.whitelist == null) {
      return true;
    }
    if (typeof value === 'string') {
      return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1;
    } else {
      return this.whitelist.indexOf(value) > -1;
    }
  }

  public remove(node: HTMLElement): void {
    if (this.default != null) { 
      node.setAttribute(this.keyName, this.default);
    } else {
      node.removeAttribute(this.keyName);      
    }
  }

  public value(node: HTMLElement): string {
    const value = node.getAttribute(this.keyName);
    if (this.canAdd(node, value) && value) {
      return value;
    }
    if (this.default != null) {
      return this.default
    } else {
      return '';      
    }
  }
}
