import axiosInstance from './axiosInstance'

export interface Offer {
  _id: string
  templateId: string
  templateName: string
  sentTo: string
  date: string
  offerPdfUrl: string
}

export const getOffers = async (candidateId: string): Promise<Offer[]> => {
  const res = await axiosInstance.get<Offer[]>(`/candidates/${candidateId}/offers`)
  return res.data
}

export const sendOffer = async (
  candidateId: string,
  payload: {
    templateId: string
    placeholders?: Record<string, any>
  }
): Promise<Offer[]> => {
  const res = await axiosInstance.post<Offer[]>(
    `/candidates/${candidateId}/offers`,
    payload
  )
  return res.data
}
