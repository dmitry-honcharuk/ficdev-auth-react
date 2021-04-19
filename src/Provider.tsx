import { FC, useCallback, useEffect, useState } from 'react';
import { AuthContext } from './context';
import { User } from './User';
import { clearTokenCookie, getTokenCookie } from './utils/cookies';
import { getAuthorizeApiUrl } from './utils/url';

interface Props {
  clientId: string;
  audience: string;
}

export const AuthProvider: FC<Props> = ({ clientId, audience, children }) => {
  const [state, setState] = useState<{
    user: User | null;
    fulfilled: boolean;
  }>({
    user: null,
    fulfilled: typeof window !== 'undefined' ? !getTokenCookie() : false,
  });

  const setUser = useCallback((user: User | null) => {
    setState((s) => ({ ...s, user }));
  }, []);

  useEffect(() => {
    const token = getTokenCookie();

    if (!state.user && token) {
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
          clearTokenCookie();
          setState((s) => ({ ...s, fulfilled: true }));
        });
    }
  }, [clientId, state]);

  return (
    <AuthContext.Provider
      value={{
        clientId,
        audience,
        user: state.user,
        isFulfilled: state.fulfilled,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
