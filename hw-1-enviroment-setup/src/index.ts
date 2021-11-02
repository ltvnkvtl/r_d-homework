import { ProductBucket } from './app';

function main(): void {
    console.time('Creating + filling time');
    const productNames = ['milk', 'apple', 'juice', 'fish', 'mango'];
    const productBucket = new ProductBucket();

    for (let i = 0; i < 1000; i++) {
        productBucket.addProduct(productNames[i % 5]);
    }
    console.log('Creating Product bucket and filling it with 1000 products');
    console.timeEnd('Creating + filling time');

    console.time('Access time');
    productBucket.getProductByIndex(49);
    console.log('Time to access 50th element');
    console.timeEnd('Access time');
    console.log('№50', productBucket.getProductByIndex(49));
}

console.time('Main');
main();
console.log('main() function execution time');
console.timeEnd('Main');
