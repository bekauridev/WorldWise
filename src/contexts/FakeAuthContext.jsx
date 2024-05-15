import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

const FAKE_USER = {
  name: "User",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "/userIcon.svg",
};
// avatar: "https://i.pravatar.cc/100?u=zz",

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (!email || !password) throw new Error("Email not exist or wrong Password ");
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      console.log(
        `Original Password is: ${FAKE_USER.password} and Email is: ${FAKE_USER.email}`
      );
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`AuthContext was used outside AuthProvider `);
  }
  return context;
}

export { AuthProvider, useAuth };
