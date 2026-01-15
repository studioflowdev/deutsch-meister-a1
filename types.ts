
export enum ExamSection {
  HOME = 'HOME',
  HOEREN = 'HOEREN',
  LESEN = 'LESEN',
  SCHREIBEN = 'SCHREIBEN',
  SPRECHEN = 'SPRECHEN',
  SUMMARY = 'SUMMARY',
  RESULTS = 'RESULTS'
}

export enum ExamMode {
  FULL = 'FULL',
  GUIDED = 'GUIDED',
  STRICT = 'STRICT'
}

export interface Question {
  id: string;
  part: number;
  type: 'multiple-choice' | 'true-false' | 'text' | 'form';
  prompt: string;
  context?: string;
  options?: string[];
  correctAnswer?: string;
  audioScript?: string;
  hint?: string;
  translation?: string;
}

export interface ExamState {
  section: ExamSection;
  mode: ExamMode;
  guidanceEnabled: boolean;
  answers: Record<string, any>;
  startTime: number | null;
  endTime: number | null;
}

export interface CardData {
  id: string;
  type: 'word' | 'picture';
  content: string;
  topic?: string;
  icon?: string;
  imageUrl?: string; // New: for AI generated sketches
  exampleQuestion?: string;
  exampleAnswer?: string;
}
