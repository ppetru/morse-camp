import ReadTrainerStore from "./ReadTrainerStore";
import FakeTransport from "../FakeTransport";

describe("ReadTrainerStore", () => {
  let testStore;
  let fakeTransport;

  const store = () => {
    if (!testStore) {
      if (!fakeTransport) {
        fakeTransport = new FakeTransport();
      }
      testStore = new ReadTrainerStore(
        null,
        fakeTransport,
        true /* noDebounce */
      );
    }
    return testStore;
  };

  beforeEach(() => {
    fakeTransport = undefined;
    testStore = undefined;
  });

  describe("settings", () => {
    it("deals with min > max", () => {
      store().setMaxLength(3);
      store().setMinLength(5);
      expect(store().maxLength).toEqual(5);
    });

    it("deals with max < min", () => {
      store().setMinLength(5);
      store().setMaxLength(3);
      expect(store().minLength).toEqual(3);
    });

    it("deals with invalid values", () => {
      store().setMinLength("foo");
      expect(store().minLength).toEqual(2);
      store().setMaxLength("bar");
      expect(store().maxLength).toEqual(2);
    });

    it("saves and restores", () => {
      store().setMinLength(3);
      store().setMaxLength(9);
      testStore = undefined;
      return store().loadSettings.then(() => {
        expect(store().minLength).toEqual(3);
        expect(store().maxLength).toEqual(9);
      });
    });
  });

  describe("feedback", () => {
    it("saves and restores word feedback", () => {
      store().textFeedback("foo bar", 1, 2, 0);
      testStore = undefined;
      return store().loadSettings.then(() => {
        expect(store().words.keys()).toContain("foo");
        expect(store().words.keys()).toContain("bar");
      });
    });

    it("computes text feedback", () => {
      store().textFeedback("foo", 1, 1, 0);
      expect(store().texts.get(3)).toHaveProperty("trailingRatio", 1);

      store().textFeedback("foo4", 1, 2, 0);
      expect(store().texts.get(4)).toHaveProperty("trailingRatio", 0.5);

      store().textFeedback("f2", 0, 1, 0);
      expect(store().texts.get(2)).toHaveProperty("trailingRatio", 0);
    });

    describe("max length", () => {
      it("increases after enough successes", () => {
        store().setMaxLength(4);
        for (let i = 0; i < 4; i++) {
          store().textFeedback("foo" + i, 1, 1, 0);
        }
        expect(store().maxLength).toEqual(4);
        store().textFeedback("foox", 1, 1, 0);
        expect(store().texts.get(4).trailingRatio).toEqual(1);
        expect(store().maxLength).toEqual(5);
      });

      it("decreases after enough fails", () => {
        store().setMaxLength(4);
        for (let i = 0; i < 4; i++) {
          store().textFeedback("foo" + i, 0, 1, 0);
        }
        expect(store().maxLength).toEqual(4);
        store().textFeedback("foox", 0, 1, 0);
        expect(store().texts.get(4).trailingRatio).toEqual(0);
        expect(store().maxLength).toEqual(3);
      });

      it("doesn't decrease below 2", () => {
        store().setMaxLength(2);
        for (let i = 0; i < 5; i++) {
          store().textFeedback("f" + i, 0, 1, 0);
        }
        expect(store().maxLength).toEqual(2);
      });
    });

    describe("min length", () => {
      it("increases after enough successes", () => {
        store().setMinLength(4);
        for (let i = 0; i < 4; i++) {
          store().textFeedback("foo" + i, 1, 1, 0);
        }
        expect(store().minLength).toEqual(4);
        store().textFeedback("foox", 1, 1, 0);
        expect(store().texts.get(4).trailingRatio).toEqual(1);
        expect(store().minLength).toEqual(5);
      });

      it("decreases after enough fails", () => {
        store().setMinLength(4);
        for (let i = 0; i < 4; i++) {
          store().textFeedback("foo" + i, 0, 1, 0);
        }
        expect(store().minLength).toEqual(4);
        store().textFeedback("foox", 0, 1, 0);
        expect(store().texts.get(4).trailingRatio).toEqual(0);
        expect(store().minLength).toEqual(3);
      });

      it("doesn't decrease below 2", () => {
        store().setMinLength(2);
        for (let i = 0; i < 5; i++) {
          store().textFeedback("f" + i, 0, 1, 0);
        }
        expect(store().minLength).toEqual(2);
      });
    });
  });
});
