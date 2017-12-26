import generateText from "./TextGenerator";

const wordMap = new Map([
  [1, new Map([["a", 1], ["b", 2]])],
  [2, new Map([["aa", 1], ["bb", 2]])],
  [3, new Map([["aaa", 1], ["bbb", 2]])]
]);

it("picks something", () => {
  const store = { minLength: 1, maxLength: 3 };
  expect(generateText(store, wordMap, "")).toBeDefined();
});

it("deals with empty map", () => {
  const store = { minLength: 1, maxLength: 3 };
  expect(generateText(store, new Map(), "")).toBeNull();
});

it("respects the min/max length", () => {
  const store = { minLength: 2, maxLength: 2 };
  expect(generateText(store, wordMap, "").length).toEqual(2);
});
