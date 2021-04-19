import Cookies from 'js-cookie';
import { COOKIE_NAME } from '../constants';

export function setTokenCookie(token: string): void {
  // A year
  Cookies.set(COOKIE_NAME, token, { expires: 365 });
}

export function clearTokenCookie(): void {
  Cookies.remove(COOKIE_NAME);
}

export function getTokenCookie(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}
