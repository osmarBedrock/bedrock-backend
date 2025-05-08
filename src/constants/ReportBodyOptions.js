"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportByMinutes = exports.reportWithoutOrderBy = exports.reportWithOrderBy = void 0;
exports.reportWithOrderBy = {
    dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "nthDay" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [
        {
            dimension: {
                dimensionName: "nthDay",
                orderType: "NUMERIC",
            },
        },
    ],
    keepEmptyRows: true,
};
exports.reportWithoutOrderBy = {
    dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    keepEmptyRows: true,
};
exports.reportByMinutes = {
    minuteRanges: [{ startMinutesAgo: 15, endMinutesAgo: 0 }],
    metrics: [{ name: "activeUsers" }],
};
