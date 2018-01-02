import "raf/polyfill";

window.matchMedia = jest.fn(query => ({
  matches: true
}));
