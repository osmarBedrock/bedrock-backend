"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LighthousePerformanceWeights = void 0;
var LighthousePerformanceWeights;
(function (LighthousePerformanceWeights) {
    LighthousePerformanceWeights[LighthousePerformanceWeights["FIRST_CONTENTFUL_PAINT"] = 0.1] = "FIRST_CONTENTFUL_PAINT";
    LighthousePerformanceWeights[LighthousePerformanceWeights["SPEED_INDEX"] = 0.1] = "SPEED_INDEX";
    LighthousePerformanceWeights[LighthousePerformanceWeights["LARGEST_CONTENTFUL_PAINT"] = 0.25] = "LARGEST_CONTENTFUL_PAINT";
    LighthousePerformanceWeights[LighthousePerformanceWeights["TOTAL_BLOCKING_TIME"] = 0.3] = "TOTAL_BLOCKING_TIME";
    LighthousePerformanceWeights[LighthousePerformanceWeights["CUMULATIVE_LAYOUT_SHIFT"] = 0.25] = "CUMULATIVE_LAYOUT_SHIFT";
})(LighthousePerformanceWeights || (exports.LighthousePerformanceWeights = LighthousePerformanceWeights = {}));
