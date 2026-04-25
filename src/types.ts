export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  response: string;
  userId: string;
  createdAt: string;
  deletedAt?: string;
  isDeleted?: boolean;
  isFavorite: boolean;
  isSafetyTriggered: boolean;
}

export interface PhilosophyDimension {
  left: string;
  right: string;
  value: number; // 0 to 100, where 0 is full left and 100 is full right
}

export interface UserProfile {
  userId: string;
  themes: string[];
  tone: string;
  style: string;
  recentShift: string;
  psychology?: string;
  resonance?: string[];
  philosophy?: PhilosophyDimension[];
  updatedAt: string;
}
