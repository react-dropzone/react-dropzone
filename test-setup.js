// https://github.com/testing-library/jest-dom#with-vitest
import '@testing-library/jest-dom/vitest';

// NOTE: Let us test {isSecureContext}!
Object.defineProperty(globalThis, 'isSecureContext', {
    value: true,
    writable: true,
    enumerable: true
});
