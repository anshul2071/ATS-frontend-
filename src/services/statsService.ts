import axiosInstance from './axiosInstance'

export interface PipeLineDataItem { name: string; value: number; color?: string }
export interface TimeToHireDataItem { date: string; value: number }
export interface TechDistributionDataItem { technology: string; count: number }

export interface StatsResponse {
  totalCandidates: number
  interviewsToday: number
  offersPending: number
  avgTimeToHire: number
  pipeline: PipeLineDataItem[]
  timeToHire: TimeToHireDataItem[]
  byTech: TechDistributionDataItem[]
}

export const fetchStats = async (): Promise<StatsResponse> => {
  const res = await axiosInstance.get<StatsResponse>('/stats')
  return res.data
}
