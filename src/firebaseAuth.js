// firebaseAuth.js
import { useState, useEffect, useContext, createContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Firebaseの設定ファイルをインポート

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
