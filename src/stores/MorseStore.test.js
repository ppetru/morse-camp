import MorseStore from "./MorseStore";
import FakeTransport from "../FakeTransport";

it("saves and restores settings", () => {
  const transport = new FakeTransport();
  var store = new MorseStore(null, transport, true);
  store.setCharacterSpeed(60);
  store.setEffectiveSpeed(30);
  store.setFrequency(700);
  store = new MorseStore(null, transport, true);
  return store.loadSettings.then(() => {
    expect(store.characterSpeed).toEqual(60);
    expect(store.effectiveSpeed).toEqual(30);
    expect(store.frequency).toEqual(700);
  });
});

it("caps effective speed to character speed", () => {
  const transport = new FakeTransport();
  var store = new MorseStore(null, transport, true);
  store.setCharacterSpeed(30);
  store.setEffectiveSpeed(50);
  expect(store.effectiveSpeed).toEqual(30);
});

it("caps effective speed to character speed when the latter drops", () => {
  const transport = new FakeTransport();
  var store = new MorseStore(null, transport, true);
  store.setCharacterSpeed(30);
  store.setEffectiveSpeed(50);
  expect(store.effectiveSpeed).toEqual(30);
  store.setCharacterSpeed(20);
  expect(store.effectiveSpeed).toEqual(20);
});
