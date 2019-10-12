// https://www.npmjs.com/package/jest-dom
require('@testing-library/jest-dom/extend-expect')

// TODO: Ignore warnings about act(), it refers to having async side effects updating the state;
// This happens because our async getFilesFromEvent() fn
// See https://github.com/kentcdodds/react-testing-library/issues/281,
// https://github.com/facebook/react/issues/14769
jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
