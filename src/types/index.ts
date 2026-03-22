export interface ProgrammeLevel {
  level: number;
  title: string;
  description: string;
  successCriteria: string;
  failureCriteria: string;
  sessionLength: string;
  tips?: string[];
}

export interface Programme {
  id: string;
  name: string;
  description: string;
  icon: string;
  levels: ProgrammeLevel[];
}

export interface Session {
  id?: number;
  programmeId: string;
  level: number;
  date: string;
  duration: number; // seconds
  successReps: number;
  failReps: number;
  outcome: 'advance' | 'repeat' | 'regress';
  quickRating: 'good' | 'mixed' | 'regression';
  notes: string;
  // Reactivity-specific
  triggerType?: string;
  thresholdDistance?: number;
  triggerOutcome?: 'disengaged' | 'redirected' | 'reacted';
  // Impulse control
  impulseResponse?: 'ignored' | 'looked_returned' | 'fixated' | 'lunged' | 'snapped';
  // Heel
  pullingIncidents?: number;
  engagementDuration?: number;
  // Scent work
  timeToFind?: number;
  falseAlerts?: number;
  enthusiasm?: number; // 1-5
  // Jumping/greeting
  urinationOccurred?: boolean;
}

export interface Incident {
  id?: number;
  date: string;
  time: string;
  description: string;
  trigger: string;
  severity: number; // 1-5
  action: string;
  notes: string;
  relatedProgramme?: string;
}

export interface UserProgress {
  id?: number;
  programmeId: string;
  currentLevel: number;
  completedLevels: number[];
  startedAt: string;
  updatedAt: string;
}

export interface TreatType {
  name: string;
  value: 'low' | 'medium' | 'high';
}

export interface AppSettings {
  id?: number;
  recallCue: string;
  releaseWord: string;
  markerWord: string;
  treats: TreatType[];
  darkMode: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 1,
  recallCue: 'Come!',
  releaseWord: 'OK',
  markerWord: 'Yes!',
  treats: [
    { name: 'Kibble', value: 'low' },
    { name: 'Cheese', value: 'medium' },
    { name: 'Chicken', value: 'high' },
  ],
  darkMode: false,
  reminderEnabled: false,
  reminderTime: '09:00',
};
