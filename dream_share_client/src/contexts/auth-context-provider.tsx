import { createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AuthContext = createContext<any>();

const StoreContext = createContext<any>();

export function Provider(props: any) {
  const [token, setToken] = createSignal(localStorage.getItem("toke") ? localStorage.getItem("toke") : null);
  const [currentUserInfo, setCurrentUserInfo] = createStore({
    username: localStorage.getItem("username") ? localStorage.getItem("username") : "",
    fullname: localStorage.getItem("fullname") ? localStorage.getItem("fullname") : "",
    user_id: localStorage.getItem("id") ? localStorage.getItem("id") : ""
  });

  async function checkToken(token: string) {
    const response = await fetch(import.meta.env.VITE_USER_URL, {
      method: "GET",
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const result = await response.json();
    if (result.errors) {
      setToken(null);
      localStorage.clear();
    }
  }

  if (token() != null) {
    checkToken(token()!);
  }

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
