export interface TokenPersistenceService {
  setToken: (token: string) => void;
  clearToken: () => void;
  getToken: () => string | null;
}
