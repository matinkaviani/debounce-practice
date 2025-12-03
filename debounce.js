/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{ leading?: boolean }} [options]
 * @returns {Function & { cancel: () => void }}
 */

// type TOptions = {
//   leading?: boolean;
// };

// interface IDebounce {
//   fn: () => void;
//   wait: number;
//   options: TOptions;
// }

function debounce(fn, wait, options) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// TEST PLAYGROUND
function log(message) {
  console.log(message);
}

function operation(value) {
  log(`debounced call with: ${value}`);
}

const debouncedFunction = debounce(operation, 2000);

async function simulateType() {
  const val = ["H", "HE", "HEL", "HELL", "HELLO"];

  for (const v of val) {
    log(`is typing: ${v}`);
    debouncedFunction(v);
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 500)
    );
  }
}

simulateType();
