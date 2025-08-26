import type { User } from 'firebase/auth';

export interface Review {
  id: string;
  author: {
    name: string | null;
    avatar: string | null;
    uid: string;
  };
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
