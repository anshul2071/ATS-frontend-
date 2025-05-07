// src/pages/InterviewCalendar.tsx
import React, { useEffect, useState } from 'react'
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Event as RBCEvent,
} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  Modal,
  Typography,
  Descriptions,
  Spin,
  Alert,
  Tooltip,
} from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import axiosInstance from '../services/axiosInstance'

const { Title } = Typography

// Backend interview shape: candidate may be null
interface IInterview {
  _id: string
  candidate: { name: string; email: string } | null
  interviewerEmail: string
  pipelineStage: string
  date: string
  meetLink: string
}

// Extend react-big-calendar event to carry the full interview
interface InterviewEvent extends RBCEvent {
  resource: IInterview
}

export default function InterviewCalendar() {
  const [events, setEvents] = useState<InterviewEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<IInterview | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)

  const localizer = momentLocalizer(moment)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axiosInstance.get<IInterview[]>('/interviews')
        const evts = res.data
          // 1) drop any interview missing a candidate
          .filter(i => {
            if (!i.candidate) {
              console.warn('Dropping interview with null candidate:', i._id)
              return false
            }
            return true
          })
          // 2) map to the calendar event shape
          .map<InterviewEvent>(i => ({
            title: '',       // we’ll build the label in the renderer
            start: new Date(i.date),
            end:   moment(i.date).add(30, 'minutes').toDate(),
            resource: i,
          }))
        setEvents(evts)
      } catch (e: any) {
        console.error('Failed to load interviews:', e)
        setError(e.message || 'Failed to load interviews')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSelectEvent = (evt: InterviewEvent) => {
    setSelected(evt.resource)
    setDetailVisible(true)
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <CalendarOutlined /> Interview Calendar
      </Title>

      {loading ? (
        <Spin tip="Loading interviews…" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '75vh' }}
          views={['month','week','day','agenda']}
          defaultView="month"
          popup
          onSelectEvent={handleSelectEvent}
          components={{
            // Custom event renderer with null-check
            event: ({ event }: { event: InterviewEvent }) => {
              const iv = event.resource
              const time = moment(event.start).format('HH:mm')
              const label = iv.candidate
                ? `${time} ${iv.candidate.name} — ${iv.pipelineStage}`
                : `${time} (Unknown candidate)`

              return (
                <Tooltip title={iv.meetLink}>
                  <span>{label}</span>
                </Tooltip>
              )
            },
          }}
        />
      )}

      <Modal
        open={detailVisible}
        footer={null}
        onCancel={() => setDetailVisible(false)}
        title="Interview Details"
      >
        {selected ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Candidate">
              {selected.candidate
                ? `${selected.candidate.name} (${selected.candidate.email})`
                : 'Unknown candidate'}
            </Descriptions.Item>
            <Descriptions.Item label="Interviewer">
              {selected.interviewerEmail}
            </Descriptions.Item>
            <Descriptions.Item label="Stage">
              {selected.pipelineStage}
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {moment(selected.date).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Google Meet Link">
              <a
                href={selected.meetLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selected.meetLink}
              </a>
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </div>
  )
}
