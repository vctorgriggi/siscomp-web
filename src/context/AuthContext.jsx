import { createContext, useState, useContext } from "react";

import { signIn, signUp, signOut } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (dto) => {
    try {
      const data = await signIn(dto);
      setUser(data);
    } catch (error) {
      throw error;
    }
  };

  const register = async (dto) => {
    try {
      const data = await signUp(dto);
      setUser(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
