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
  title?: string;
  examDate?: string;
  avatarUrl?: string;
  notificationsEnabled?: boolean;
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

export interface ActivityLog {
  id: string;
  type: 'auth' | 'task_complete' | 'task_add' | 'pomodoro' | 'badge_unlock' | 'chat';
  description: string;
  timestamp: string;
}

export interface Dua {
  id: string;
  category: string;
  text: string;
  source?: string;
}

export interface HeroNote {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  isPinned: boolean;
  color: string;
}


