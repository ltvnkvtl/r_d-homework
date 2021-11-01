// NOT TASK
// Another behavior if .then() with callback
let interval = setInterval(() => {
  console.log('(5)');
  clearInterval(interval)
});

setImmediate(() => console.log('(9)'));

setTimeout(() => console.log('(6)'));

process.nextTick(() => console.log('(3)'));

console.log('(1)');

let myPromise = () => new Promise((resolve) => setTimeout(() => {console.log('(7)');resolve()}));
let myPromise2 = () => new Promise((resolve) => {console.log('(2)');resolve()});


myPromise().then(() => {
  console.log('(8)')
});
myPromise2().then(() => {
  console.log('(4)')
});
