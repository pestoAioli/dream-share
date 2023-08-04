import { createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AuthContext = createContext<any>([false, () => { }]);

const StoreContext = createContext<any>();

export function Provider(props: any) {
  const [token, setToken] = createSignal(localStorage.getItem("toke") ? localStorage.getItem("toke") : null);
  const [currentUserInfo, setCurrentUserInfo] = createStore({
    username: "",
    fullname: ""
  });

  return (
    <AuthContext.Provider value={[token, setToken]}>
      <StoreContext.Provider value={[currentUserInfo, setCurrentUserInfo]}>
        {props.children}
      </StoreContext.Provider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useStore() {
  return useContext(StoreContext)
}
