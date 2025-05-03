export interface SearchConsoleQueryRequest {
    startDate: string;
    endDate: string;
    dimensions?: string[];
    filters?: any[];
    rowLimit?: number;
    aggregationType?: string;
}