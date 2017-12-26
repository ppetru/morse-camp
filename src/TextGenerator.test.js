import generateText from "./TextGenerator";
import CopyTrainerStore from "./stores/CopyTrainerStore";
import FakeTransport from "./FakeTransport";

const wordMap = new Map([
  [1, new Map([["a", 1], ["b", 2]])],
  [2, new Map([["aa", 1], ["bb", 2]])],
  [3, new Map([["aaa", 1], ["bbb", 2]])]
]);

it("picks something", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(1);
  store.setMaxLength(3);
  expect(generateText(store, wordMap)).toBeDefined();
});

it("deals with empty map", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(1);
  store.setMaxLength(3);
  expect(generateText(store, new Map())).toBeNull();
});

it("respects the min/max length", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(2);
  store.setMaxLength(2);
  expect(generateText(store, wordMap).length).toEqual(2);
});

it("doesn't pick words that were already successful", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(2);
  store.setMaxLength(2);
  store.textFeedback("aa", 1, 1);
  expect(generateText(store, wordMap)).toEqual("bb");
});
