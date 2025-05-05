// src/constants/pipelineStages.ts

// 1) All the stages you track on the candidate‑card side:
export const PIPELINE_STAGES = [
  "Shortlisted",
  "HR Screening",
  "Technical Interview",
  "Managerial Interview",
  "Hired",
  "Rejected",
  "Blacklisted",
] as const

export type PipelineStage = typeof PIPELINE_STAGES[number]


// 2) Only the *interview* stages (from Shortlisted up through Managerial Interview):
export const INTERVIEW_PIPELINE_STAGES = [

  "HR Screening",
  "Technical Interview",
  "Managerial Interview",
] as const

export type InterviewPipelineStage = typeof INTERVIEW_PIPELINE_STAGES[number]
