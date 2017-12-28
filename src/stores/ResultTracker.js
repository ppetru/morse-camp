import { extendObservable, observable } from "mobx";

export default class ResultTracker {
  constructor(size) {
    this.size = size;

    extendObservable(this, {
      // TODO: do these really need to be observable?
      success: 0,
      total: 0,
      results: observable([]),

      get overallRatio() {
        if (this.total === 0) {
          return 0;
        } else {
          return this.success / this.total;
        }
      },

      get trailingRatio() {
        if (this.results.length === 0) {
          return 0;
        }
        const total = this.results.reduce(
          (sum, value) => [sum[0] + value[0], sum[1] + value[1]],
          [0, 0]
        );
        return total[0] / total[1];
      }
    });
  }

  record(success, count) {
    if (this.results.push([success, count]) > this.size) {
      this.results.shift();
    }
    this.total += count;
    if (success) {
      this.success++;
    }
  }
}
