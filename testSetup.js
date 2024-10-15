// https://www.npmjs.com/package/jest-dom
import "@testing-library/jest-dom/extend-expect";

Object.defineProperty(global, "isSecureContext", {
  value: true,
  writable: true,
  enumerable: true,
});
