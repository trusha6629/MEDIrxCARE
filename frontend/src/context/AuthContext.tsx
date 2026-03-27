import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  phone?: string;
  avatar?: string;
  status?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    // Store in localStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("role", newUser.role);

    // Update state
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);

    // Navigate to appropriate dashboard
    if (newUser.role === "doctor") {
      navigate("/doctor", { replace: true });
    } else if (newUser.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login page
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
