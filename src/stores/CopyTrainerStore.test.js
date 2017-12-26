import CopyTrainerStore from "./CopyTrainerStore";
import FakeTransport from "../FakeTransport";

it("deals with min > max", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMaxLength(3);
  store.setMinLength(5);
  expect(store.maxLength).toEqual(5);
});

it("deals with max < min", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength(5);
  store.setMaxLength(3);
  expect(store.minLength).toEqual(3);
});

it("deals with invalid values", () => {
  const store = new CopyTrainerStore(null, new FakeTransport());
  store.setMinLength("foo");
  expect(store.minLength).toEqual(0);
  store.setMaxLength("bar");
  expect(store.maxLength).toEqual(0);
});
