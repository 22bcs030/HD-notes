import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';

// Define action types
enum ActionType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAIL = 'LOGIN_FAIL',
  LOGOUT = 'LOGOUT',
  CLEAR_ERROR = 'CLEAR_ERROR',
  SET_LOADING = 'SET_LOADING',
}

// Define actions
type Action =
  | { type: ActionType.LOGIN_SUCCESS; payload: User }
  | { type: ActionType.LOGIN_FAIL; payload: string }
  | { type: ActionType.LOGOUT }
  | { type: ActionType.CLEAR_ERROR }
  | { type: ActionType.SET_LOADING; payload: boolean };

// Define auth context
interface AuthContextProps {
  state: AuthState;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case ActionType.LOGIN_SUCCESS:
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case ActionType.LOGIN_FAIL:
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case ActionType.LOGOUT:
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case ActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case ActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch({ type: ActionType.LOGIN_SUCCESS, payload: JSON.parse(user) });
    }
  }, []);

  // Login action
  const login = (user: User) => {
    dispatch({ type: ActionType.LOGIN_SUCCESS, payload: user });
  };

  // Logout action
  const logout = () => {
    dispatch({ type: ActionType.LOGOUT });
  };

  // Clear error action
  const clearError = () => {
    dispatch({ type: ActionType.CLEAR_ERROR });
  };

  // Set loading action
  const setLoading = (isLoading: boolean) => {
    dispatch({ type: ActionType.SET_LOADING, payload: isLoading });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
