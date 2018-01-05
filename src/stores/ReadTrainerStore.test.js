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
    describe("words", () => {
      it("saves and restores", () => {
        store().textFeedback("foo bar", true, 2, 0);
        testStore = undefined;
        return store().loadSettings.then(() => {
          expect(store().words.keys()).toContain("foo");
          expect(store().words.keys()).toContain("bar");
        });
      });

      it("increases score for success", () => {
        store().textFeedback("foo", true, 2, 0);
        store().textFeedback("bar", false, 1, 0);
        const s_foo = store().words.get("foo").score;
        const s_bar = store().words.get("bar").score;
        store().textFeedback("foo bar", true, 1, 0);
        expect(store().words.get("foo").score).toBeGreaterThan(s_foo);
        expect(store().words.get("bar").score).toBeGreaterThan(s_bar);
      });

      it("decreases score for failure", () => {
        store().textFeedback("foo bar", true, 1, 0);
        const s_foo = store().words.get("foo").score;
        const s_bar = store().words.get("bar").score;
        store().textFeedback("foo", false, 1, 0);
        store().textFeedback("bar", true, 2, 0);
        expect(store().words.get("foo").score).toBeLessThan(s_foo);
        expect(store().words.get("bar").score).toBeLessThan(s_bar);
      });

      it("changes score proportional to attempts", () => {
        store().textFeedback("foo bar", true, 1, 0);
        store().textFeedback("baz qux", true, 4, 0);
        store().textFeedback("foo baz", true, 2, 0);
        store().textFeedback("bar qux", true, 3, 0);
        expect(store().words.get("foo").score).toBeGreaterThan(
          store().words.get("bar").score
        );
        expect(store().words.get("baz").score).toBeGreaterThan(
          store().words.get("qux").score
        );
      });
    });

    describe("text length", () => {
      it("saves and restores", () => {
        store().textFeedback("12", true, 2, 0);
        store().textFeedback("123", true, 2, 0);
        testStore = undefined;
        return store().loadSettings.then(() => {
          expect(store().lengths.keys()).toContain("2");
          expect(store().lengths.keys()).toContain("3");
        });
      });

      it("increases score for success", () => {
        store().textFeedback("12", true, 2, 0);
        store().textFeedback("123", false, 1, 0);
        const s2 = store().lengths.get(2).score;
        const s3 = store().lengths.get(3).score;
        store().textFeedback("12", true, 1, 0);
        store().textFeedback("123", true, 2, 0);
        expect(store().lengths.get(2).score).toBeGreaterThan(s2);
        expect(store().lengths.get(3).score).toBeGreaterThan(s3);
      });

      it("decreases score for failure", () => {
        store().textFeedback("12", true, 1, 0);
        store().textFeedback("123", true, 1, 0);
        const s2 = store().lengths.get(2).score;
        const s3 = store().lengths.get(3).score;
        store().textFeedback("12", false, 1, 0);
        store().textFeedback("123", true, 2, 0);
        expect(store().lengths.get(2).score).toBeLessThan(s2);
        expect(store().lengths.get(3).score).toBeLessThan(s3);
      });

      it("changes score proportional to attempts", () => {
        store().textFeedback("12", true, 1, 0);
        store().textFeedback("123", true, 1, 0);
        store().textFeedback("1234", true, 4, 0);
        store().textFeedback("12345", true, 4, 0);
        const s2 = store().lengths.get(2).score;
        const s4 = store().lengths.get(3).score;
        store().textFeedback("12", true, 2, 0);
        store().textFeedback("123", true, 3, 0);
        store().textFeedback("1234", true, 2, 0);
        store().textFeedback("12345", true, 3, 0);
        expect(store().lengths.get(3).score).toBeLessThan(s2);
        expect(store().lengths.get(5).score).toBeLessThan(s4);
      });
    });

    describe("length adjustment", () => {
      describe("min", () => {
        it("increases when score is high enough", () => {
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().adjustLengths();
          expect(store().minLength).toEqual(3);
        });

        it("decreases when score is low enough", () => {
          store().setMinLength(3);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().adjustLengths();
          expect(store().minLength).toEqual(2);
        });

        it("doesn't flip flop", () => {
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().adjustLengths();
          expect(store().minLength).toEqual(3);
          store().textFeedback("123", false, 1, 0);
          store().adjustLengths();
          expect(store().minLength).toEqual(3);
        });
      });

      describe("max", () => {
        it("increases when score is high enough", () => {
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().adjustLengths();
          expect(store().maxLength).toEqual(3);
        });

        it("decreases when score is low enough", () => {
          store().setMaxLength(3);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().textFeedback("123", false, 1, 0);
          store().adjustLengths();
          expect(store().maxLength).toEqual(2);
        });

        it("doesn't flip flop", () => {
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().textFeedback("12", true, 1, 0);
          store().adjustLengths();
          expect(store().maxLength).toEqual(3);
          store().textFeedback("123", false, 1, 0);
          store().adjustLengths();
          expect(store().maxLength).toEqual(3);
        });
      });
    });
  });
});
