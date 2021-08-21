export class ApplicationError implements Error {
  public name = 'ApplicationError';

  constructor (public message: string) {}

  public toString(): string {
    return `${this.name}: ${this.message}`
  }
}
