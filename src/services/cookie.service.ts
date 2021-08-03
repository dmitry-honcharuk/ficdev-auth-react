import Cookies from 'js-cookie';
import { TokenPersistenceService } from './TokenPersistenceService';

export function cookieServiceFactory({ cookieName }: FactoryOptions): TokenPersistenceService {
  return {
    setToken: (token: string): void => {
      Cookies.set(cookieName, token, { expires: 365 });
    },
    clearToken: (): void => {
      Cookies.remove(cookieName);
    },
    getToken: (): string | null => {
      return Cookies.get(cookieName) ?? null;
    },
  };
}

interface FactoryOptions {
  cookieName: string;
}
