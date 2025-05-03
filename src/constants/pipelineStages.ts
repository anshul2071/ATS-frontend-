
export const PIPELINE_STAGES = [
    'Shortlisted',
    'HR Screening',
    'Technical Interview',
    'Managerial Interview',
    'Hired',
    'Rejected',
    'Blacklisted',
  ] as const
  
  export type PipelineStage = typeof PIPELINE_STAGES[number]
  