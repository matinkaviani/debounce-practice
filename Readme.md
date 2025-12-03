Debounce (Core JS → React Hook)

## Part A — Implement `debounce`

**Goal:** Write a **pure JavaScript** `debounce(fn, wait, options?)` that delays invoking `fn` until `wait` ms have passed since the **last** call.

### Signature

```js
/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{ leading?: boolean }} [options]
 * @returns {Function & { cancel: () => void }}
 */
function debounce(fn, wait, options) {
  /* your code */
}
```

### Requirements

- Default: `leading = false`.
- Core behavior: call `fn` **once** after the calls stop for `wait` ms, using the **latest** arguments.
- If `leading = true`, call `fn` immediately on the first call in a burst, then **suppress further calls** until there has been a quiet period of `wait` ms.
- Preserve `this` and the latest args.
- Provide `.cancel()` on the returned function to clear any pending call.
- Errors thrown by `fn` should surface to the caller of the debounced wrapper.

### Edge cases to consider

- Rapid bursts of calls.
- `wait = 0`.
- Combinations of `leading` and `cancel`.

---

## Mental model for `leading`

### `leading` (default: `false`)

**What it means:** Fire **immediately** on the first call in a burst.

**How it feels:** “Respond right away, then pause.”

**Timeline (wait = 300ms):**

```text
calls:   |a     b     c|
time →   0----100---200---300
leading=false:
  (no immediate call)                FIRE(c)  (300ms after last call)

leading=true:
  FIRE(a)                            (then ignore until quiet)
```

After a leading fire, further calls within the `wait` window are **ignored** until the timer has fully elapsed and there has been a quiet period.

---

## Part B — Wrap in a React Hook

**Goal:** Create `useDebouncedCallback` that reuses your Part A function.

### Signature (TypeScript-ish)

```ts
function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options?: { leading?: boolean },
  deps?: any[]
): T & { cancel: () => void };
```

### Requirements

- Use your Part A `debounce` internally.
- Avoid stale closures: always call the **latest** `fn` passed into the hook.
- The debounced callback should have stable identity unless `wait`, `options`, or `deps` change.
- Clean up timers on unmount (call `cancel()` in an effect cleanup).

---

## Deliverables

- `debounce.js` (or `.ts`) — implementation of the simplified debounce.
- `useDebouncedCallback.ts(x)` — React hook built on top of `debounce`.
- A brief README or inline comments explaining:
  - Default “after typing stops” behavior.
  - What `leading` does.
  - How `cancel()` works.
- (Optional) minimal demo or quick tests showing default behavior and `leading` + `cancel` usage.
