/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{ leading?: boolean }} [options]
 * @returns {Function & { cancel: () => void }}
 */

type TOptions = {
  leading?: boolean;
};

function debounce(fn: (value: string) => void, wait: number, options?: TOptions) {
  let timeoutId: NodeJS.Timeout;
  const { leading = false } = options || {};

  return function (this: any, ...args: any) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// TEST PLAYGROUND
function log(message: string) {
  console.log(message);
}

function operation(value: string) {
  log(`debounced call with: ${value}`);
}

const debouncedFunction = debounce(operation, 2000);

async function simulateType() {
  const val = ["H", "HE", "HEL", "HELL", "HELLO"];

  for (const v of val) {
    log(`is typing: ${v}`);
    debouncedFunction(v);
    await new Promise<void>((res) =>
      setTimeout(() => {
        res();
      }, 500)
    );
  }
}

simulateType();
