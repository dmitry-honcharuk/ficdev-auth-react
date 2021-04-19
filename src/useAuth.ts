import { useCallback, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './context';
import { User } from './User';
import { clearTokenCookie, setTokenCookie } from './utils/cookies';
import { getAuthorizePageUrl } from './utils/url';

export function useAuth(): AuthHook {
  const { clientId, audience, user, setUser, isFulfilled } = useContext(AuthContext);
  const authWindowRef = useRef<Window | null>(null);
  const onAuthSuccessRef = useRef<AuthorizeWithRedirect>();

  useEffect(() => {
    function handleMessage({ data }: AuthMessage) {
      const message = data.ficdev_auth;

      if (message && authWindowRef.current) {
        const { auth_token, user } = message;

        setUser(user);
        setTokenCookie(auth_token);
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
  }, [setUser]);

  const authorizeWithRedirect = useCallback<AuthorizeWithRedirect>(
    (options) => {
      if (!audience || !clientId) {
        throw new Error('Audience and client id are required');
      }

      onAuthSuccessRef.current = options?.onSuccess;
      authWindowRef.current = window.open(getAuthorizePageUrl({ audience, clientId }));
    },
    [clientId, audience],
  );

  const logout = useCallback(() => {
    clearTokenCookie();
    setUser(null);
  }, [setUser]);

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
    user: { id: string };
  };
}>;
