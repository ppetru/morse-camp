beforeAll(() => {
  window.matchMedia = jest.fn(query => ({
    matches: true
  }));
});
