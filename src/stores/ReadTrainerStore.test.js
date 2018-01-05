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
  });
});
