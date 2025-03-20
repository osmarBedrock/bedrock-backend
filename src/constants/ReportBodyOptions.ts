export type ReportBodyOptions = {
    dateRanges?: { startDate: string; endDate: string }[];
    minuteRanges?: { startMinutesAgo: number; endMinutesAgo: number }[];
    dimensions?: { name: string }[];
    metrics?: { name: string }[];
    orderBys?: {
      dimension: {
        dimensionName: string;
        orderType: string;
      };
    }[];
    keepEmptyRows?: boolean;
};

export const reportWithOrderBy: ReportBodyOptions = {
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


export const reportWithoutOrderBy: ReportBodyOptions = {
    dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    keepEmptyRows: true,
};

export const reportByMinutes: ReportBodyOptions = {
    minuteRanges: [{ startMinutesAgo: 15, endMinutesAgo: 0 }],
    metrics: [{ name: "activeUsers" }],
};