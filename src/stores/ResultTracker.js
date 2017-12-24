import { extendObservable, observable } from "mobx";

export class ResultTracker {
  constructor() {
    extendObservable(this, {
      success: 0,
      total: 0,
      results: observable([])
    });
  }

  record(success, count) {
    if (this.results.push([success, count]) > 20) {
      this.results.shift();
    }
    this.total += count;
    if (success) {
      this.success++;
    }
  }

  get overallRatio() {
    if (this.total === 0) {
      return 0;
    } else {
      return this.success / this.total;
    }
  }

  get ratio() {
    if (this.results.length === 0) {
      return 0;
    }
    const total = this.results.reduce(
      (sum, value) => [sum[0] + value[0], sum[1] + value[1]],
      [0, 0]
    );
    return total[0] / total[1];
  }
}
