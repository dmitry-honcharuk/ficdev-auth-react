import { cookieServiceFactory } from './cookie.service';
import { localStorageServiceFactory } from './local-storage.service';
import { TokenPersistenceService } from './TokenPersistenceService';

export function tokenPersistenceServiceFactory({ keyName }: FactoryOptions): TokenPersistenceService {
  const cookieService = cookieServiceFactory({ cookieName: keyName });
  const localStorageService = localStorageServiceFactory({ keyName });

  return {
    setToken: (token: string): void => {
      cookieService.setToken(token);
      localStorageService.setToken(token);
    },
    clearToken: (): void => {
      cookieService.clearToken();
      localStorageService.clearToken();
    },
    getToken: (): string | null => {
      const token = localStorageService.getToken();

      if (token) {
        cookieService.setToken(token);
      } else {
        cookieService.clearToken();
      }

      return token;
    },
  };
}

interface FactoryOptions {
  keyName: string;
}
