import Cookies from 'js-cookie';

export function cookieServiceFactory({ cookieName }: FactoryOptions): CookieService {
  return {
    setTokenCookie: (token: string): void => {
      Cookies.set(cookieName, token, { expires: 365 });
    },
    clearTokenCookie: (): void => {
      Cookies.remove(cookieName);
    },
    getTokenCookie: (): string | undefined => {
      return Cookies.get(cookieName);
    },
  };
}

interface CookieService {
  setTokenCookie: (token: string) => void;
  clearTokenCookie: () => void;
  getTokenCookie: () => string | undefined;
}

interface FactoryOptions {
  cookieName: string;
}
