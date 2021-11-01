import { getRandomInt } from './utils/helper-functions';

export class ProductBucket {
  private readonly _bucket: Product[];

  constructor() {
    this._bucket = [];
  }

  public addProduct(name: string): Product {
    const newProduct = new Product(name);
    this._bucket.push(newProduct);
    return newProduct;
  }

  public get allProducts(): Product[] {
    return this._bucket;
  }

  public getProductByIndex(idx: number): Product {
    return this._bucket[idx];
  }
}

class Product {
  name: string;
  price: number;

  constructor(name: string) {
    this.name = name;
    this.price = getRandomInt(1, 100);
  }
}
