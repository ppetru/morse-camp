import { PRODUCERS } from "./TextProducers";

const [letter, digit, punctuation, prosign, top5k, cw] = PRODUCERS;

it("does not repeat prosigns", () => {
  var pattern = [
    {
      producer: "repeats",
      size: 2
    },
    {
      producer: prosign.producerName,
      size: 1
    }
  ];
  var p = prosign(1, pattern.slice(1), 2, 1);
  expect(p).toBeNull();
});
