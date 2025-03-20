import { ReportBodyOptions } from "../constants/ReportBodyOptions";
import { BuildBodyOptions } from "../interfaces/analytics";

export function buildReportBody({ startDate, endDate, range, metrics, dimensions = [], keepEmptyRows = false }: BuildBodyOptions, isRealTimeReport: boolean = false): ReportBodyOptions {
  if (isRealTimeReport)
    return {
      minuteRanges: [{ startMinutesAgo: 15, endMinutesAgo: 0 }], // realtime data in last 15 minutes
      metrics: [{ name: "activeUsers" }]
    }

  const body: ReportBodyOptions = {
      dateRanges: [{ startDate, endDate }],
      metrics: metrics.map((metric) => ({ name: metric })),
      dimensions: dimensions.length
        ? dimensions.map((dimension) => ({ name: dimension }))
        : [{ name: range === "quarter" ? "nthWeek" : "nthDay" }],
      keepEmptyRows,
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