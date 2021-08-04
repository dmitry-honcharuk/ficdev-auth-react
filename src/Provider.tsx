import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './context';
import { tokenPersistenceServiceFactory } from './services/token-persistence.service';
import { User } from './User';
import { getAuthorizeApiUrlFactory } from './utils/url';

interface Props {
  clientId: string;
  audience: string;
  urlBase: string;
  storageKeyName?: string;
  tokenHeaderName?: string;
}

export const AuthProvider: FC<Props> = ({
  clientId,
  audience,
  children,
  urlBase,
  storageKeyName: keyName = 'ficdev-auth-token',
  tokenHeaderName = 'x-ficdev-auth-token',
}) => {
  const tokenPersistenceService = useMemo(() => tokenPersistenceServiceFactory({ keyName }), [keyName]);

  const [state, setState] = useState<{
    user: User | null;
    fulfilled: boolean;
    token: string | null;
  }>({
    user: null,
    fulfilled: typeof window !== 'undefined' ? !tokenPersistenceService.getToken() : false,
    token: null,
  });

  const setUser = useCallback((user: User | null) => {
    setState((s) => ({ ...s, user }));
  }, []);

  const setToken = useCallback((token: string) => {
    setState((s) => ({ ...s, token }));
  }, []);

  useEffect(() => {
    const token = tokenPersistenceService.getToken();

    if (!state.user && token) {
      const getAuthorizeApiUrl = getAuthorizeApiUrlFactory({ urlBase });

      const headers = new Headers();

      headers.append('authorization', `Bearer ${token}`);

      fetch(getAuthorizeApiUrl({ clientId }), { headers })
        .then((res) => {
          if (res.status < 400) {
            return res.json();
          }

          throw new Error();
        })
        .then((user) => setState({ user, fulfilled: true, token }))
        .catch(() => {
          tokenPersistenceService.clearToken();
          setState((s) => ({ ...s, fulfilled: true }));
        });
    }
  }, [clientId, tokenPersistenceService, state, urlBase]);

  return (
    <AuthContext.Provider
      value={{
        clientId,
        audience,
        user: state.user,
        isFulfilled: state.fulfilled,
        setUser,
        setToken,
        urlBase,
        tokenPersistenceService,
        tokenHeaderName,
        token: state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
