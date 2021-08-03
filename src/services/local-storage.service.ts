import { TokenPersistenceService } from './TokenPersistenceService';

export function localStorageServiceFactory({ keyName }: FactoryOptions): TokenPersistenceService {
  return {
    setToken: (token: string): void => {
      localStorage.setItem(keyName, token);
    },
    clearToken: (): void => {
      localStorage.removeItem(keyName);
    },
    getToken: (): string | null => {
      return localStorage.getItem(keyName);
    },
  };
}

interface FactoryOptions {
  keyName: string;
}
