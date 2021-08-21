export class SystemError implements Error {
  public name = 'SystemError';

  constructor(public message: string) {}

  public toString(): string {
    return `${this.name}: ${this.message}`
  }
}
