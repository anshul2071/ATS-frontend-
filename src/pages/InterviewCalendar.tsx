// src/pages/InterviewCalendar.tsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { Modal, Typography, Descriptions, Spin, Alert } from 'antd';
import axiosInstance from '../services/axiosInstance';

const { Title } = Typography;

interface IInterview {
  _id: string;
  candidate: { name: string; email: string };
  interviewerEmail: string;
  pipelineStage: string;
  date: string;      // ISO string
  meetLink: string;
}

interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  extendedProps: { interview: IInterview };
}

const InterviewCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const res = await axiosInstance.get<IInterview[]>('/interviews');
        const evts = res.data.map<CalendarEvent>((i) => ({
          id: i._id,
          title: `${i.candidate.name} — ${i.pipelineStage}`,
          start: i.date,
          extendedProps: { interview: i },
        }));
        setEvents(evts);
      } catch (e: any) {
        setError(e.message || 'Failed to load interviews');
      } finally {
        setLoading(false);
      }
    }
    fetchInterviews();
  }, []);

  const onEventClick = (arg: EventClickArg) => {
    // FullCalendar v6+ puts our extendedProps on arg.event.extendedProps
    const evt = arg.event;
    setSelected({
      id: evt.id,
      title: evt.title,
      start: evt.startStr,
      extendedProps: evt.extendedProps as { interview: IInterview },
    });
    setDetailVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Interview Calendar</Title>

      {loading ? (
        <Spin tip="Loading interviews…" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={onEventClick}
          height="auto"
        />
      )}

      <Modal
        open={detailVisible}
        footer={null}
        onCancel={() => setDetailVisible(false)}
        title="Interview Details"
      >
        {selected && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Candidate">
              {selected.extendedProps.interview.candidate.name} (
              {selected.extendedProps.interview.candidate.email})
            </Descriptions.Item>
            <Descriptions.Item label="Interviewer">
              {selected.extendedProps.interview.interviewerEmail}
            </Descriptions.Item>
            <Descriptions.Item label="Stage">
              {selected.extendedProps.interview.pipelineStage}
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {new Date(selected.start).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Google Meet Link">
              <a
                href={selected.extendedProps.interview.meetLink}
                target="_blank"
                rel="noreferrer"
              >
                {selected.extendedProps.interview.meetLink}
              </a>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default InterviewCalendar;
