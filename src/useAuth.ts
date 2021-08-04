import { useCallback, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './context';
import { User } from './User';
import { getAuthorizePageUrlFactory } from './utils/url';

export function useAuth(): AuthHook {
  const {
    audience,
    clientId,
    isFulfilled,
    setToken,
    setUser,
    token,
    tokenHeaderName,
    tokenPersistenceService,
    urlBase,
    user,
  } = useContext(AuthContext);

  const authWindowRef = useRef<Window | null>(null);
  const onAuthSuccessRef = useRef<AuthorizeWithRedirect>();

  useEffect(() => {
    function handleMessage({ data }: AuthMessage) {
      const message = data.ficdev_auth;

      if (message && authWindowRef.current) {
        const { auth_token, user } = message;

        setUser(user);
        setToken(auth_token);
        tokenPersistenceService?.setToken(auth_token);
        authWindowRef.current.close();

        if (onAuthSuccessRef.current) {
          onAuthSuccessRef.current();
        }
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [tokenPersistenceService, setUser, setToken]);

  const authorizeWithRedirect = useCallback<AuthorizeWithRedirect>(
    (options) => {
      if (!audience || !clientId) {
        throw new Error('Audience and client id are required');
      }

      const getAuthorizePageUrl = getAuthorizePageUrlFactory({ urlBase });

      onAuthSuccessRef.current = options?.onSuccess;
      authWindowRef.current = window.open(getAuthorizePageUrl({ audience, clientId }));
    },
    [audience, clientId, urlBase],
  );

  const logout = useCallback(() => {
    tokenPersistenceService?.clearToken();
    setUser(null);
  }, [tokenPersistenceService, setUser]);

  const headers = new Headers();

  if (token) {
    headers.set(tokenHeaderName, token);
  }

  return {
    authorizeWithRedirect,
    user,
    isFulfilled,
    logout,
    authTokenHeaders: headers,
  };
}

type AuthorizeWithRedirect = (options?: { onSuccess: () => void }) => void;

type AuthHook = {
  authorizeWithRedirect: AuthorizeWithRedirect;
  logout: () => void;
  user: User | null;
  isFulfilled: boolean;
  authTokenHeaders: Headers;
};

type AuthMessage = MessageEvent<{
  ficdev_auth?: {
    auth_token: string;
    user: User;
  };
}>;
