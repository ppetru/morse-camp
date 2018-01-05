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
      store().textFeedback("foo bar", true, 2, 0);
      testStore = undefined;
      return store().loadSettings.then(() => {
        expect(store().words.keys()).toContain("foo");
        expect(store().words.keys()).toContain("bar");
      });
    });

    it("increases score for successful words", () => {
      store().textFeedback("foo", true, 2, 0);
      store().textFeedback("bar", false, 1, 0);
      const s_foo = store().words.get("foo").score;
      const s_bar = store().words.get("bar").score;
      store().textFeedback("foo bar", true, 1, 0);
      expect(store().words.get("foo").score).toBeGreaterThan(s_foo);
      expect(store().words.get("bar").score).toBeGreaterThan(s_bar);
    });

    it("decreases score for unsuccessful words", () => {
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
});
