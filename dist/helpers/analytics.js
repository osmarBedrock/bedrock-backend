"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = getDateRange;
exports.buildReportBody = buildReportBody;
const date_fns_1 = require("date-fns");
function getDateRange(range) {
    let startDate = "yesterday";
    const endDate = "yesterday";
    let yesterday = (0, date_fns_1.sub)(new Date(), { days: 1 });
    switch (range) {
        case "day": {
            startDate = "2daysAgo";
            break;
        }
        case "week": {
            startDate = "7daysAgo";
            break;
        }
        case "month": {
            startDate = "30daysAgo";
            break;
        }
        case "quarter": {
            let start = (0, date_fns_1.sub)(yesterday, { days: 89 });
            startDate = (0, date_fns_1.format)(start, "yyyy-MM-dd");
            break;
        }
        default: {
            startDate = "7daysAgo";
            break;
        }
    }
    return { startDate, endDate };
}
function buildReportBody({ startDate, endDate, range, metrics, dimensions = [], keepEmptyRows = false }, isRealTimeReport = false) {
    if (isRealTimeReport)
        return {
            minuteRanges: [{ startMinutesAgo: 15, endMinutesAgo: 0 }], // realtime data in last 15 minutes
            metrics: [{ name: "activeUsers" }]
        };
    const body = {
        dateRanges: [{ startDate, endDate }],
        metrics: metrics.map((name) => ({ name })),
        dimensions: dimensions.length
            ? dimensions.map((dimension) => ({ name: dimension }))
            : [{ name: range === "quarter" ? "nthWeek" : "nthDay" }],
        keepEmptyRows,
        metricAggregations: ["TOTAL"]
    };
    if (range === "quarter") {
        body.orderBys = [
            {
                dimension: {
                    dimensionName: "nthWeek",
                    orderType: "NUMERIC",
                },
            },
        ];
    }
    return body;
}
