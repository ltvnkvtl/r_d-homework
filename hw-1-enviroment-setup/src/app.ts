import { getRandomInt } from './utils/helper-functions';

export class ProductBucket {
    private readonly bucket: Product[];

    constructor() {
        this.bucket = [];
    }

    public addProduct(name: string): Product {
        const newProduct = new Product(name);
        this.bucket.push(newProduct);

        return newProduct;
    }

    public get allProducts(): Product[] {
        return this.bucket;
    }

    public getProductByIndex(idx: number): Product {
        return this.bucket[idx];
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
