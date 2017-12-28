import CopyTrainerStore from "./CopyTrainerStore";
import FakeTransport from "../FakeTransport";

describe("CopyTrainerStore", () => {
  let testStore;
  let fakeTransport;

  const store = () => {
    if (!testStore) {
      if (!fakeTransport) {
        fakeTransport = new FakeTransport();
      }
      testStore = new CopyTrainerStore(
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
    expect(store().minLength).toEqual(0);
    store().setMaxLength("bar");
    expect(store().maxLength).toEqual(0);
  });

  it("saves and restores settings", () => {
    store().setMinLength(3);
    store().setMaxLength(9);
    testStore = undefined;
    return store().loadSettings.then(() => {
      expect(store().minLength).toEqual(3);
      expect(store().maxLength).toEqual(9);
    });
  });

  it("saves and restores word feedback", () => {
    store().textFeedback("foo bar", 1, 2, 0);
    testStore = undefined;
    return store().loadSettings.then(() => {
      expect(store().words.keys()).toContain("foo");
      expect(store().words.keys()).toContain("bar");
    });
  });
});
