export const throttle = (function() {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  return function throttle(callback: any, duration: number) {
    if (timeout === undefined) {
      callback();
      timeout = setTimeout(() => {
        // allow another call to be throttled
        timeout = undefined;
      }, duration);
    }
  }
})();
  
/**
 * Wraps callback in a function and throttles it.
 * @returns Wrapper function
 */
export const throttlify = (callback: any, duration: number) => {
  return function throttlified(event: any) {
    throttle(() => {
      if (typeof callback === 'function') callback(event);
    }, duration);
  }
}
