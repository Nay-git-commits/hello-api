import { createContext } from 'react';

export const UserContext = createContext({ user: { isLoggedIn: false }, login: () => {}, logout: () => {} });

export default UserContext;
