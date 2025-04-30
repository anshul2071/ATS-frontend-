import axiosInstance from './axiosInstance'

export interface Offer {
  _id: string
  template: string
  sentTo: string
  date: string
}

export const getOffers = async (candidateId: string): Promise<Offer[]> => {
  const res = await axiosInstance.get<Offer[]>(`/candidates/${candidateId}/offers`)
  return res.data
}

export const sendOffer = async (
  candidateId: string,
  payload: { template: string; placeholders?: string }
): Promise<Offer[]> => {
  const res = await axiosInstance.post<Offer[]>(`/candidates/${candidateId}/offers`, payload)
  return res.data
}
