import {ProductBucket} from "../../src/app";

describe('Product and ProductBucket', () => {
  let productBucket: ProductBucket = new ProductBucket();
  ['milk', 'apple', 'juice', 'fish', 'mango'].forEach(name => productBucket.addProduct(name))

  it('Product bucket should be defined', () => {
    expect(productBucket).toBeDefined();
  })

  it('bucket should have 5 product', () => {
    expect(productBucket.allProducts.length).toBe(5);
  })

  it('third product in bucket should be "milk"', () => {
    expect(productBucket.getProductByIndex(2).name).toBe('juice');
  })

  it('products should have price between 0 and 100', () => {
    productBucket.allProducts.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(1);
      expect(product.price).toBeLessThanOrEqual(100);
    })
  })
})
