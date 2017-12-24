export class ResultTracker {
  constructor() {
    this.success = 0;
    this.total = 0;
    this.results = [];
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

  get pickProbability() {
    const r = Math.floor(this.ratio * 100);
    var p;
    if (r < 5 || r > 95) {
      p = 1;
    } else if (r < 20 || r > 80) {
      p = 10;
    } else {
      p = 80;
    }
    return p / 100;
  }

  get canProgress() {
    return this.results.length > 5 && this.ratio > 0.5;
  }
}
