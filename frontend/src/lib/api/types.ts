export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'coordinator' | 'volunteer' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ReferralInput {
  childName: string;
  age: number;
  gender: string;
  medicalCondition: string;
  location: string;
  guardianContact: string;
  additionalNotes?: string;
}