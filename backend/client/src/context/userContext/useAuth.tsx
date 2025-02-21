import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
} from "../../services/api";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | undefined>();
  const [message, setMessage] = useState<AuthMessage | undefined>();
  const [error, setError] = useState<string | undefined>(); // ✅ Ensure error is always a string
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Clear error on route change
  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  // Fetch user on initial load
  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data.user);
      })
      .catch((_error) => {}) // No need to set error for this
      .finally(() => setLoadingInitial(false));
  }, []);

  // ✅ Fixed error handling
  const handleError = (err: any) => {
    return err.response?.data?.message || err.message || "An error occurred!";
  };

  const register = (user: RegisterUser) => {
    setLoading(true);
    setError(undefined);
    registerUser(user)
      .then((data) => {
        setUser(data.user);
        setMessage(data.message);
        setTimeout(() => {
          setMessage(undefined);
          navigate("/users/login");
        }, 2000);
      })
      .catch((err) => setError(handleError(err)))
      .finally(() => setLoading(false));
  };

  const login = (user: LoginUser) => {
    setLoading(true);
    setError(undefined);
    loginUser(user)
      .then((data) => {
        setUser(data.user);
        setMessage(data.message);
        setTimeout(() => {
          setMessage(undefined);
          navigate("/users/my-account");
        }, 2000);
      })
      .catch((err) => setError(handleError(err)))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    logoutUser().then((data) => {
      setUser(undefined);
      setMessage(data.message);
      setTimeout(() => {
        setMessage(undefined);
        navigate("/");
      }, 2000);
    });
  };

  const memoedValue = useMemo(
    () => ({
      user,
      message,
      error,
      loading,
      register,
      login,
      logout,
    }),
    [user, message, error, loading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
