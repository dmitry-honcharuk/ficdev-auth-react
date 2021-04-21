import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './context';
import { cookieServiceFactory } from './services/cookie';
import { User } from './User';
import { getAuthorizeApiUrlFactory } from './utils/url';

interface Props {
  clientId: string;
  audience: string;
  urlBase: string;
  cookieName: string;
}

export const AuthProvider: FC<Props> = ({ clientId, audience, children, urlBase, cookieName }) => {
  const cookieService = useMemo(() => cookieServiceFactory({ cookieName }), [cookieName]);

  const [state, setState] = useState<{
    user: User | null;
    fulfilled: boolean;
  }>({
    user: null,
    fulfilled: typeof window !== 'undefined' ? !cookieService.getTokenCookie() : false,
  });

  const setUser = useCallback((user: User | null) => {
    setState((s) => ({ ...s, user }));
  }, []);

  useEffect(() => {
    const token = cookieService.getTokenCookie();

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
        .then((user) => setState({ user, fulfilled: true }))
        .catch(() => {
          cookieService.clearTokenCookie();
          setState((s) => ({ ...s, fulfilled: true }));
        });
    }
  }, [clientId, cookieService, state, urlBase]);

  return (
    <AuthContext.Provider
      value={{
        clientId,
        audience,
        user: state.user,
        isFulfilled: state.fulfilled,
        setUser,
        urlBase,
        cookieName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
