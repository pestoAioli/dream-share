import { createContext, createSignal, useContext } from "solid-js";

const AuthContext = createContext<any>([false, () => { }]);

export function AuthContextProvider(props: any) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(localStorage.getItem("toke") ? true : false);


  return (
    <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext);
}
