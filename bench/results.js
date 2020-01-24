const {join} = require('path');
const {readFileSync, writeFileSync} = require('fs');
const minifiers = require('./minifiers');
const tests = require('./tests');

const RESULTS_DIR = join(__dirname, 'results');
const SPEEDS_JSON = join(RESULTS_DIR, 'speeds.json');
const SPEEDS_GRAPH = join(RESULTS_DIR, 'speeds.png');
const AVERAGE_SPEEDS_GRAPH = join(RESULTS_DIR, 'average-speeds.png');
const SIZES_JSON = join(RESULTS_DIR, 'sizes.json');
const SIZES_GRAPH = join(RESULTS_DIR, 'sizes.png');
const AVERAGE_SIZES_GRAPH = join(RESULTS_DIR, 'average-sizes.png');

const minifierNames = Object.keys(minifiers);
const testNames = tests.map(t => t.name);

module.exports = {
  writeSpeedResults(speeds) {
    writeFileSync(SPEEDS_JSON, JSON.stringify(speeds, null, 2));
  },
  writeSizeResults(sizes) {
    writeFileSync(SIZES_JSON, JSON.stringify(sizes, null, 2));
  },
  writeAverageSpeedsGraph(data) {
    writeFileSync(AVERAGE_SPEEDS_GRAPH, data);
  },
  writeSpeedsGraph(data) {
    writeFileSync(SPEEDS_GRAPH, data);
  },
  writeAverageSizesGraph(data) {
    writeFileSync(AVERAGE_SIZES_GRAPH, data);
  },
  writeSizesGraph(data) {
    writeFileSync(SIZES_GRAPH, data);
  },
  getSpeedResults() {
    const data = JSON.parse(readFileSync(SPEEDS_JSON, 'utf8'));

    return {
      // Get minifier-speed pairs sorted by speed ascending.
      getAverageRelativeSpeedPerMinifier(baselineMinifier) {
        return minifierNames.map(minifier => [
          minifier,
          testNames
            // Get operations per second for each test.
            .map(test => data[test][minifier] / data[test][baselineMinifier])
            // Sum all test operations per second.
            .reduce((sum, c) => sum + c)
          // Divide by tests count to get average operations per second.
          / testNames.length,
        ]).sort((a, b) => a[1] - b[1]);
      },
      // Get minifier-speeds pairs.
      getRelativeFileSpeedsPerMinifier(baselineMinifier) {
        return minifierNames.map(minifier => [
          minifier,
          testNames.map(test => [test, data[test][minifier] / data[test][baselineMinifier]]),
        ]);
      },
    };
  },
  getSizeResults() {
    const data = JSON.parse(readFileSync(SIZES_JSON, 'utf8'));

    return {
      // Get minifier-size pairs sorted by size descending.
      getAverageRelativeSizePerMinifier() {
        return minifierNames.map(minifier => [
          minifier,
          testNames
            .map(test => data[test][minifier].relative)
            .reduce((sum, c) => sum + c)
          / testNames.length,
        ]).sort((a, b) => b[1] - a[1]);
      },
      // Get minifier-sizes pairs.
      getRelativeFileSizesPerMinifier() {
        return minifierNames.map(minifier => [
          minifier,
          testNames.map(test => [test, data[test][minifier].relative]),
        ]);
      },
    };
  },
};
