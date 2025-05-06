import { format, sub } from "date-fns";
import { BuildBodyOptions } from "../interfaces/analytics";
import { analyticsdata_v1beta } from "googleapis";

export function getDateRange(range: string): { startDate: string, endDate: string } {
  let startDate = "yesterday";
  const endDate = "yesterday";
  let yesterday = sub(new Date(), { days: 1 });

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
      let start = sub(yesterday, { days: 89 });
      startDate = format(start, "yyyy-MM-dd");
      break;
    }
    default: {
      startDate = "7daysAgo";
      break;
    }
  }

  return { startDate, endDate };
}

export function buildReportBody({ startDate, endDate, range, metrics, dimensions = [], keepEmptyRows = false }: BuildBodyOptions, isRealTimeReport: boolean = false): analyticsdata_v1beta.Params$Resource$Properties$Runreport | any {

  if (isRealTimeReport)
    return {
      minuteRanges: [{ startMinutesAgo: 15, endMinutesAgo: 0 }], // realtime data in last 15 minutes
      metrics: [{ name: "activeUsers" }]
    }

  const body: analyticsdata_v1beta.Schema$RunReportRequest = {
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