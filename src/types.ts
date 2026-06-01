/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  branch: 'science' | 'math' | 'literature' | '';
  dreamCollege: string;
  targetScore: number;
  studyTime: 'morning' | 'evening' | '';
  isConfigured: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  isCompleted: boolean;
  energyPoints: number;
  pomodoroCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requiredPoints: number;
  unlockedAt?: string;
}

export interface StudyChallenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  targetCount: number;
  currentCount: number;
  category: 'pomodoro' | 'tasks' | 'vent' | 'continuous';
  isClaimed: boolean;
}
