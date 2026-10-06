export interface ChallengeQueryParams {
  search?: string;
  type?: string;
  page?: number;
  perPage?: number;
}

// Personal Achievement API Response Types
export interface ChallengeScore {
  total: number;
  quiz: number;
  puzzle: number;
  ordering: number;
  fillBlank: number;
}

export interface MyScoreResponse {
  userId: string;
  totalScore: number;
  lessonScore: number;
  challengeScore: ChallengeScore;
}

export interface LeaderboardUser {
  id: string;
  fullName: string;
  avatar: string | null;
  grade: string | null;
  total_score: number;
  lesson_score: number;
  challenge_score: number;
  rank: number;
}

export interface LeaderboardParams {
  limit?: number;
  grade?: string;
}

interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'quiz' | 'video' | 'assignment'; // Adjust types if needed
  order: number;
  status: string;
  created_at: string;
  updated_at: string;
  maxScore: number;
}

export interface IChallengeResponse {
  data: Challenge[];
}

export interface TotalScore {
  totalScore: number;
  userId: string;
}
