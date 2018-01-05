import { computeWordWeights, REPEAT_DELAY_MS } from "./TextGenerator";

describe("Text generation", () => {
  describe("computeWordWeights", () => {
    const dictionary = new Map([
      ["foo", 1],
      ["bar", 1],
      ["baz", 2],
      ["quux", 2]
    ]);
    let testState;

    const state = () => {
      if (!testState) {
        testState = new Map();
      }
      return testState;
    };

    beforeEach(() => {
      testState = undefined;
    });

    it("doesn't change weights if state is empty", () => {
      let result = computeWordWeights(dictionary, state(), 0);
      expect(result).toEqual(dictionary);
      state().set("something", { time: 0, score: 0.5 });
      result = computeWordWeights(dictionary, state(), REPEAT_DELAY_MS);
      expect(result).toEqual(dictionary);
    });

    it("doesn't change weights if state is invalid", () => {
      state().set("foo", "hahah fail");
      state().set("bar", { wut: 1000, lol: 1 });
      let result = computeWordWeights(dictionary, state(), 0);
      expect(result).toEqual(dictionary);
    });

    it("repeats words only after enough time", () => {
      state().set("foo", { time: 0, score: 1 });
      state().set("bar", { time: 1000, score: 1 });
      const result = computeWordWeights(dictionary, state(), REPEAT_DELAY_MS);
      expect(result.get("foo")).not.toEqual(0);
      expect(result.get("bar")).toEqual(0);
    });

    it("increases weight proportional to time elapsed", () => {
      state().set("foo", { time: 0, score: 1 });
      state().set("bar", { time: 1000, score: 1 });
      const result = computeWordWeights(
        dictionary,
        state(),
        REPEAT_DELAY_MS + 1000
      );
      expect(result.get("foo")).not.toEqual(0);
      expect(result.get("bar")).toBeLessThan(result.get("foo"));
    });

    it("increases weight inversely proportional to score", () => {
      state().set("foo", { time: 0, score: 0 });
      state().set("bar", { time: 0, score: 0.5 });
      state().set("baz", { time: 0, score: 1 });
      const result = computeWordWeights(dictionary, state(), REPEAT_DELAY_MS);
      expect(result.get("foo")).not.toEqual(dictionary.get("foo"));
      expect(result.get("bar")).not.toEqual(dictionary.get("bar"));
      expect(result.get("baz")).toEqual(dictionary.get("baz"));
      expect(result.get("bar")).toBeLessThan(result.get("foo"));
    });
  });
});
