import { stringify } from 'query-string';
import { AUTH_URL_BASE } from '../constants';

export function getAuthorizePageUrl({ audience, clientId }: { audience: string; clientId: string }): string {
  return `${AUTH_URL_BASE}/authorize?${stringify({
    audience,
    clientId,
  })}`;
}

export function getAuthorizeApiUrl({ clientId }: { clientId: string }): string {
  return `${AUTH_URL_BASE}/api/${clientId}/authorize`;
}
