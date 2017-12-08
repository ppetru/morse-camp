import { PRODUCERS } from './TextProducers';

const [
  letter,
  digit,
  punctuation,
  prosign,
  top5k,
  cw
] = PRODUCERS;

it('does not repeat prosigns', () => {
  var pattern = [ 2 ];
  var p1 = prosign(1, pattern, 2, 0);
  pattern.push(prosign.producerName + ":" + 1);
  var p2 = prosign(1, pattern, 2, 1);
  expect(p2).toBeNull();
})
