//UserProvider.jsx
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
export function UserProvider ({children}) {
 // const initialUser = {
 // isLoggedIn: false,
 // name: '',
 // email: ''
 // };
 const initialUser = JSON.parse(localStorage.getItem("session")) ?? {
 isLoggedIn: false, name: '', email: ''
 };
 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
 const [user, setUser] = useState(initialUser);
 const login = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.log("Login failed:", res.status, data);
            return false;
        }
        const newUser = { isLoggedIn: true, name: data.name ?? "", email };
        setUser(newUser);
        localStorage.setItem("session", JSON.stringify(newUser));
        return true;
    } catch (error) {
        console.log("Login Exception: ", error);
        return false;
    }
 };
 const logout = async () => {
 const result = await fetch(`${API_URL}/api/user/logout`, {
 method: "POST",
 credentials: "include"
 });
 const newUser = { isLoggedIn: false, name: '', email: '' };
 setUser(newUser);
 localStorage.setItem("session", JSON.stringify(newUser));
 }
 return (
 <UserContext.Provider value={{user, login, logout}}>
 {children}
 </UserContext.Provider>
 );
}
export function useUser () {
 return useContext(UserContext);
} 