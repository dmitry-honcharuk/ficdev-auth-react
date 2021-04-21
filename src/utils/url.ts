import { stringify } from 'query-string';

export function getAuthorizePageUrlFactory({ urlBase }: FactoryOptions) {
  return ({ audience, clientId }: { audience: string; clientId: string }): string => {
    return `${urlBase}/authorize?${stringify({
      audience,
      clientId,
    })}`;
  };
}

export function getAuthorizeApiUrlFactory({ urlBase }: FactoryOptions) {
  return ({ clientId }: { clientId: string }): string => {
    return `${urlBase}/api/${clientId}/authorize`;
  };
}

interface FactoryOptions {
  urlBase: string;
}
