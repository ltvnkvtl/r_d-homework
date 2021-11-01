let interval = setInterval(() => {
  console.log('(6)');
  clearInterval(interval)
});

setImmediate(() => console.log('(9)'));

setTimeout(() => console.log('(7)'));

process.nextTick(() => console.log('(5)'));

console.log('(1)');

let myPromise = () => new Promise((resolve) => setTimeout(() => {console.log('(8)');resolve()}));
let myPromise2 = () => new Promise((resolve) => {console.log('(3)');resolve()});


myPromise().then(console.log('(2)'));
myPromise2().then(console.log('(4)'));
