import axiosInstance from "./axiosInstance";

export interface PipeLineDataItem {
    name: string;
    value: number;
    color?: string;
}


export interface TimeToHireDataItem {
    date: string,
    value: number;
}

export interface TechDistributionDataItem {
    technology: string;
    count: number;
}

export interface AnalyticsData {
    pipeline : PipeLineDataItem[];
    timeToHire : TimeToHireDataItem[];
    byTech: TechDistributionDataItem[];
}

export const getAnalyticsData = async():Promise<AnalyticsData> => {
    const res = await axiosInstance.get<AnalyticsData>('/stats');
    return res.data;
}