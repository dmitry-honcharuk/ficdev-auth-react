import { createContext } from 'react';
import { TokenPersistenceService } from './services/TokenPersistenceService';
import { User } from './User';

interface Context {
  clientId: string | null;
  audience: string | null;
  user: User | null;
  isFulfilled: boolean;
  setUser: (user: User | null) => void;
  urlBase: string;
  tokenPersistenceService: TokenPersistenceService | null;
  tokenHeaderName: string;
}

export const AuthContext = createContext<Context>({
  clientId: null,
  audience: null,
  user: null,
  isFulfilled: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  urlBase: '',
  tokenPersistenceService: null,
  tokenHeaderName: '',
});
