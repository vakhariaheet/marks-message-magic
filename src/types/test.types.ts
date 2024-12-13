export interface Test {
  title: string;
  questions: string;
  isgiven: boolean;
  totalQuestions: number;
  topic: string;
}

export interface TestResult {
  id: string;
  name: string;
  obtainedMarks: number;
  totalMarks: number;
}