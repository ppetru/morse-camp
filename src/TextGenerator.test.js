import { generateText, REPEAT_DELAY_MS } from "./TextGenerator";
import CopyTrainerStore from "./stores/CopyTrainerStore";
import FakeTransport from "./FakeTransport";

const wordMap = new Map([
  [1, new Map([["a", 1], ["b", 2]])],
  [2, new Map([["aa", 1], ["bb", 2]])],
  [3, new Map([["aaa", 1], ["bbb", 2], ["ccc", 3]])]
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

it("picks successful words when enough time passed", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(2);
  store.setMaxLength(2);
  store.textFeedback("aa", 1, 1, 0);
  store.textFeedback("bb", 1, 1, 20);
  expect(generateText(store, wordMap, REPEAT_DELAY_MS + 10)).toEqual("aa");
});

it("doesn't pick successful words when not enough time passed", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(2);
  store.setMaxLength(2);
  store.textFeedback("aa", 1, 1, 0);
  expect(generateText(store, wordMap, REPEAT_DELAY_MS - 10)).toEqual("bb");
});

it("picks unsuccessful words after enough time passed", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(3);
  store.setMaxLength(3);
  store.textFeedback("ccc", 1, 2, 0);
  store.textFeedback("bbb", 1, 1, 1);
  expect(generateText(store, wordMap, REPEAT_DELAY_MS + 10)).toEqual("ccc");
});

it("doesn't pick unsuccessful words when not enough time passed", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(3);
  store.setMaxLength(3);
  store.textFeedback("ccc", 1, 2, 0);
  store.textFeedback("bbb", 1, 1, 1);
  expect(generateText(store, wordMap, REPEAT_DELAY_MS - 10)).toEqual("aaa");
});
