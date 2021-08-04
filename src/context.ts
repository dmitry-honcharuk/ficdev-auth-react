import { createContext } from 'react';
import { TokenPersistenceService } from './services/TokenPersistenceService';
import { User } from './User';

interface Context {
  clientId: string | null;
  audience: string | null;
  user: User | null;
  isFulfilled: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  urlBase: string;
  tokenPersistenceService: TokenPersistenceService | null;
  tokenHeaderName: string;
  token: string | null;
}

export const AuthContext = createContext<Context>({
  clientId: null,
  audience: null,
  user: null,
  isFulfilled: false,
  setUser: () => {},
  setToken: () => {},
  urlBase: '',
  tokenPersistenceService: null,
  tokenHeaderName: '',
  token: null,
});
