export class Objects {
  static equals<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
 
  static isNull(obj: unknown): boolean {
    return obj === null || obj === undefined;
  }

  static nonNull(obj: unknown): boolean {
    return !Objects.isNull(obj);
  }

  static toString(obj: unknown): string {
    if (obj === null || obj === undefined) return 'null';
    return obj.toString();
  }
}
