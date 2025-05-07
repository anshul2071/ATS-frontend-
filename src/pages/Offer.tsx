// src/pages/Offer.tsx
import React, { useEffect, useState } from 'react'
import { Card, Select, Spin, message } from 'antd'
import type { DefaultOptionType } from 'antd/lib/select'
import OfferForm from '../pages/OfferForm'
import axiosInstance from '../services/axiosInstance'

interface Cand {
  _id: string
  name: string
}

const Offer: React.FC = () => {
  const [candidates, setCandidates] = useState<Cand[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>()

  // Prepare the options array once
  const candidateOptions: DefaultOptionType[] = candidates.map(c => ({
    value: c._id,
    label: c.name,
  }))

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get<Cand[]>('/candidates')
      .then(res => setCandidates(res.data))
      .catch(() => message.error('Failed to load candidates'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Card title="New Offer" style={{ maxWidth: 600, margin: '24px auto' }}>
      <Select<string, DefaultOptionType>
        showSearch
        placeholder="Pick candidate"
        options={candidateOptions}
        value={selectedCandidateId}
        onChange={id => setSelectedCandidateId(id)}
        allowClear
        filterOption={(input, option) =>
          // coerce `option.label` to string before calling .toLowerCase()
          String(option?.label ?? '')
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        style={{ width: '100%', marginBottom: 16 }}
      />

      {selectedCandidateId && (
        <OfferForm
          candidateId={selectedCandidateId}
          onSuccess={() => {
            message.success('Offer sent successfully')
            setSelectedCandidateId(undefined)
          }}
        />
      )}
    </Card>
  )
}

export default Offer
