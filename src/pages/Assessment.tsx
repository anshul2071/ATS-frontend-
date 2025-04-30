import React, { useEffect, useState } from 'react'
import { Card, Select, Spin, message } from 'antd'
import AssessmentForm from './AssessmentForm'
import axiosInstance from  '../services/axiosInstance'

interface Cand { _id: string; name: string }

const Assessment: React.FC = () => {
  const [candidates, setCandidates] = useState<Cand[]>([])
  const [loading, setLoading] = useState(false)
  const [sel, setSel] = useState<string>()

  useEffect(() => {
    setLoading(true)
    axiosInstance.get<Cand[]>('/candidates')
      .then(r => setCandidates(r.data))
      .catch(() => message.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin style={{ marginTop: 100 }} />

  return (
    <Card title="New Assessment" style={{ maxWidth: 600, margin: '24px auto' }}>
      <Select
        placeholder="Pick candidate"
        value={sel}
        onChange={v => setSel(v)}
        style={{ marginBottom: 16, width: '100%' }}
      >
        {candidates.map(c => (
          <Select.Option key={c._id} value={c._id}>
            {c.name}
          </Select.Option>
        ))}
      </Select>
      {sel && <AssessmentForm candidateId={sel} />}
    </Card>
  )
}

export default Assessment
