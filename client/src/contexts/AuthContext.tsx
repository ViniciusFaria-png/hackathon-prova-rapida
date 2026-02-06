import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  professorName?: string;
  isProfessor?: boolean;
  professorId?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export interface DecodedToken {
  sub?: string;
  id?: string;
  userId?: string;
  email?: string;
  professorName?: string;
  professor_name?: string;
  isProfessor?: boolean;
  is_professor?: boolean;
  professorId?: number;
  professor_id?: number;
  exp?: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);
