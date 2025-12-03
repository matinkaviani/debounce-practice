/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{ leading?: boolean }} [options]
 * @returns {Function & { cancel: () => void }}
 */

type TOptions = {
  leading?: boolean;
};

export default function debounce(fn: (value: string) => void, wait: number, options?: TOptions) {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastCallTime: number | null = null;
  let lastThis: any;
  let lastArgs: any[] = [];
  let lastResult: any;
  let lastCallError: Error | null = null;

  const { leading = false } = options || {};

  const debounced = function (this: any, ...args: any) {
    const now = Date.now();
    const isFirstCall = lastCallTime === null;

    lastThis = this;
    lastArgs = args;

    if (timeoutId !== null) clearTimeout(timeoutId);

    if (leading && isFirstCall) {
      try {
        lastResult = fn.apply(this, args);
      } catch (err) {
        lastCallError = err as Error;
        throw lastCallError;
      }
      lastCallTime = now;
    }

    timeoutId = setTimeout(() => {
      if (!leading || !isFirstCall) {
        try {
          lastResult = fn.apply(lastThis, lastArgs as [string]);
          lastCallError = null;
        } catch (error) {
          lastCallError = error as Error;
          throw lastCallError;
        }
      }
      timeoutId = null;
      lastCallTime = null;
    }, wait);
  };

  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = null;
    lastArgs = [];
    lastCallError = null;
  };

  return debounced;
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

const leadingDebounced = debounce(
  (value: string) => {
    log(`leading: ${value}`);
  },
  1000,
  { leading: true }
);

leadingDebounced("A");
setTimeout(() => leadingDebounced("B"), 300);
setTimeout(() => leadingDebounced("C"), 600);

// Cancel
const cancelableDebounced = debounce((value: string) => {
  log(`cancelable: ${value}`);
}, 2000);

cancelableDebounced("X");
setTimeout(() => cancelableDebounced("Y"), 500);
setTimeout(() => cancelableDebounced.cancel(), 1000);

simulateType();
