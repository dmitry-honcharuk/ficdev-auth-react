import { useCallback, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './context';
import { cookieServiceFactory } from './services/cookie';
import { User } from './User';
import { getAuthorizePageUrlFactory } from './utils/url';

export function useAuth(): AuthHook {
  const { clientId, audience, user, setUser, isFulfilled, urlBase, cookieName } = useContext(AuthContext);

  const authWindowRef = useRef<Window | null>(null);
  const onAuthSuccessRef = useRef<AuthorizeWithRedirect>();

  useEffect(() => {
    function handleMessage({ data }: AuthMessage) {
      const message = data.ficdev_auth;

      if (message && authWindowRef.current) {
        const { auth_token, user } = message;

        const cookieService = cookieServiceFactory({ cookieName });

        setUser(user);
        cookieService.setTokenCookie(auth_token);
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
  }, [cookieName, setUser]);

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
    const cookieService = cookieServiceFactory({ cookieName });

    cookieService.clearTokenCookie();
    setUser(null);
  }, [cookieName, setUser]);

  return {
    authorizeWithRedirect,
    user,
    isFulfilled,
    logout,
  };
}

type AuthorizeWithRedirect = (options?: { onSuccess: () => void }) => void;

type AuthHook = {
  authorizeWithRedirect: AuthorizeWithRedirect;
  logout: () => void;
  user: User | null;
  isFulfilled: boolean;
};

type AuthMessage = MessageEvent<{
  ficdev_auth?: {
    auth_token: string;
    user: User;
  };
}>;
