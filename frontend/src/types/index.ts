export interface User {
  _id: string;
  name: string;
  email: string;
  dob?: string;
  profilePicture?: string;
  token?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
