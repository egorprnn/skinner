import { createContext, useContext } from 'react';

import { session } from './session';

const SessionContext = createContext(session);
export const SessionProvider = SessionContext.Provider;

export const useSession = () => useContext(SessionContext);
