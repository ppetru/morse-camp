import MorseStore from "./MorseStore";
import FakeTransport from "../FakeTransport";

it("saves and restores settings", () => {
  const transport = new FakeTransport();
  var store = new MorseStore(null, transport, true);
  store.setSpeed(60);
  store.setFrequency(700);
  store = new MorseStore(null, transport, true);
  return store.loadSettings.then(() => {
    expect(store.speed).toEqual(60);
    expect(store.frequency).toEqual(700);
  });
});
