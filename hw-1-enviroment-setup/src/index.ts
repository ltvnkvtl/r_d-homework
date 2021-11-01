import {ProductBucket} from "./app";

function main(): void {
    const productNames = ['milk', 'apple', 'juice', 'fish', 'mango'];
    const productBucket = new ProductBucket();

    console.log('Filling the basket with 1000 products')
    console.time('Time');
    for (let i = 0; i < 1000; i++) {
      productBucket.addProduct(productNames[i % 5]);
    }
    console.timeEnd('Time');

    console.log('№50', productBucket.getProductByIndex(49));
}

console.time('Main');
main();
console.log('main() function execution time');
console.timeEnd('Main');
